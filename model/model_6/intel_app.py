from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import intel_extension_for_pytorch as ipex
from datasets import load_from_disk

app = Flask(_name_)
CORS(app)

#load neural Chat model and tokenizer
intel_model_path = "Intel/neural-chat-7b-v3-1"
intel_tokenizer = AutoTokenizer.from_pretrained(intel_model_path)
intel_model = AutoModelForCausalLM.from_pretrained(intel_model_path)

#load personalized model and tokenizer
personalized_model_path = "./fine_tuned_model_personalized"
personalized_tokenizer = AutoTokenizer.from_pretrained(personalized_model_path)
personalized_model = AutoModelForCausalLM.from_pretrained(personalized_model_path)

personalized_dataset = load_from_disk("processed_personalized_dataset")

#optimize with IPEX
print("Optimizing Intel Neural Chat model with IPEX...")
intel_model = ipex.optimize(intel_model)
print("Intel Neural Chat model optimized.")

print("Optimizing personalized model with IPEX...")
personalized_model = ipex.optimize(personalized_model)
print("Personalized model optimized.")

def generate_response(model, tokenizer, user_input):
    input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
    
    with torch.no_grad(), torch.cpu.amp.autocast():
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

    # Return the best match if the score is above a threshold
    if best_score > 0.5:
        return best_match['output']
    return None

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_input = data['message']

    personalized_response = find_best_match(user_input, personalized_dataset)
    
    if personalized_response:
        final_response = personalized_response
    else:
        # If no exact match, generate response from personalized model
        personalized_response = generate_response(personalized_model, personalized_tokenizer, user_input)
        
        # If personalized model response is not relevant, fall back to Intel Neural Chat model
        if len(personalized_response) < 30:
            final_response = generate_response(intel_model, intel_tokenizer, user_input)
        else:
            final_response = personalized_response
    
    # Post-process the response to ensure it's within the desired word range
    words = final_response.split()
    if len(words) > 300:
        final_response = ' '.join(words[:300]) + '...'
    
    return jsonify({'response': final_response})

if _name_ == '_main_':
    app.run(debug=True)
