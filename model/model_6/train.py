import torch
import intel_extension_for_pytorch as ipex
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_from_disk
from neural_compressor import PostTrainingQuantConfig, quantization

# Load the processed dataset
dataset = load_from_disk("processed_kisanvaani_dataset")

# Load the model and tokenizer
model_name = "microsoft/DialoGPT-small"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# Optimize the model with IPEX
model = ipex.optimize(model)

# Tokenize the dataset
def tokenize_function(examples):
    full_texts = [f"{input}{tokenizer.eos_token}{output}" for input, output in zip(examples['input'], examples['output'])]
    tokenized = tokenizer(full_texts, truncation=True, padding="max_length", max_length=256)
    tokenized["labels"] = tokenized["input_ids"].copy()
    return tokenized

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=dataset.column_names)

# Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
    use_ipex=True,  # Enable IPEX
)

# Create Trainer instance
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

# Start training
trainer.train()

# Save the fine-tuned model
model.save_pretrained("./fine_tuned_dialogpt_kisanvaani")
tokenizer.save_pretrained("./fine_tuned_dialogpt_kisanvaani")

# Quantize the model
quantization_config = PostTrainingQuantConfig(
    approach="static",
    quant_format="QDQ",
    backend="ipex",
    calibration_sampling_size=300,
)

quantized_model = quantization.fit(
    model=model,
    conf=quantization_config,
    calib_dataloader=trainer.get_train_dataloader(),
)

# Save the quantized model
quantized_model.save("./quantized_fine_tuned_dialogpt_kisanvaani")

print("Fine-tuning and quantization complete. Models saved to './fine_tuned_dialogpt_kisanvaani' and './quantized_fine_tuned_dialogpt_kisanvaani'")
