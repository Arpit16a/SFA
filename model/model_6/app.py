from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import intel_extension_for_pytorch as ipex
from datasets import load_from_disk
from neural_compressor import PostTrainingQuantConfig, quantization
from torch.utils.data import DataLoader, TensorDataset

app = Flask(__name__)
CORS(app)

#hugging face model and tokenizer
hf_model_path = "./fine_tuned_dialogpt_kisanvaani"
hf_tokenizer = AutoTokenizer.from_pretrained(hf_model_path)
hf_model = AutoModelForCausalLM.from_pretrained(hf_model_path)
#using ipex
hf_model = ipex.optimize(hf_model)

# Load the model+tokenizer
personalized_model_path = "./fine_tuned_model_personalized"
personalized_tokenizer = AutoTokenizer.from_pretrained(personalized_model_path)
personalized_model = AutoModelForCausalLM.from_pretrained(personalized_model_path)
personalized_model = ipex.optimize(personalized_model)  # Optimize with IPEX

#personalized dataset
personalized_dataset = load_from_disk("processed_personalized_dataset")

#quantize  the models
def quantize_model(model, tokenizer):
    quantization_config = PostTrainingQuantConfig(
        approach="dynamic",
        quant_format="QDQ",
        backend="ipex",
    )
    
    #create a simple dataset for calibration
    calib_data = ["Sample input for calibration", "Another sample input", "Yet another sample"]
    encoded_data = tokenizer(calib_data, return_tensors="pt", padding=True, truncation=True)
    dataset = TensorDataset(encoded_data['input_ids'], encoded_data['attention_mask'])
    calib_dataloader = DataLoader(dataset, batch_size=1)
    
    quantized_model = quantization.fit(
        model=model,
        conf=quantization_config,
        calib_dataloader=calib_dataloader,
    )
    
    return quantized_model

#quantize both models(hugging face and personalised)
print("Quantizing Hugging Face model...")
hf_model_quantized = quantize_model(hf_model, hf_tokenizer)
print("Hugging Face model quantized.")

print("Quantizing personalized model...")
personalized_model_quantized = quantize_model(personalized_model, personalized_tokenizer)
print("Personalized model quantized.")

def generate_response(model, tokenizer, user_input):
    input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
    
    with torch.no_grad():
        chat_history_ids = model.generate(
            input_ids,
            max_length=200,
            min_length=10,
            pad_token_id=tokenizer.eos_token_id,
            no_repeat_ngram_size=3,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.3,
            num_return_sequences=1
        )
    
    return tokenizer.decode(chat_history_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

def find_best_match(user_input, dataset):
    user_words = set(user_input.lower().split())
    best_match = None
    best_score = 0

    for item in dataset:
        question_words = set(item['input'].lower().split())
        score = len(user_words.intersection(question_words)) / len(user_words)
        
        if score > best_score:
            best_score = score
            best_match = item

    #returning the best match if the score is above a threshold (e.g., 0.5)
    if best_score > 0.5:
        return best_match['output']
    return None

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_input = data['message']
    
    # giving priority to personalised dataset first
    personalized_response = find_best_match(user_input, personalized_dataset)
    
    if personalized_response:
        final_response = personalized_response
    else:
        # if no exact match, generate response from personalized model
        personalized_response = generate_response(personalized_model_quantized, personalized_tokenizer, user_input)
        
        # if personalized model response is not relevant, go to to Hugging Face model trained dataset
        if len(personalized_response) < 30:
            final_response = generate_response(hf_model_quantized, hf_tokenizer, user_input)
        else:
            final_response = personalized_response
    
    # putting a condition of  word range
    words = final_response.split()
    if len(words) > 300:
        final_response = ' '.join(words[:300]) + '...'
    
    return jsonify({'response': final_response})

if __name__ == '__main__':
    app.run(debug=True)
