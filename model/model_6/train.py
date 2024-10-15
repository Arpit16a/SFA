import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_from_disk

# Load the processed dataset
dataset = load_from_disk("processed_kisanvaani_dataset")

# Load the model and tokenizer
model_name = "microsoft/DialoGPT-small"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# Tokenize the dataset
def tokenize_function(examples):
    # Combine input and output into a single string
    full_texts = [f"{input}{tokenizer.eos_token}{output}" for input, output in zip(examples['input'], examples['output'])]
    
    # Tokenize the text
    tokenized = tokenizer(full_texts, truncation=True, padding="max_length", max_length=256)
    
    # Set up the labels for language modeling (shift the input_ids)
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
    use_cpu=True,  # Use CPU instead of no_cuda=True
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

print("Fine-tuning complete. Model saved to './fine_tuned_dialogpt_kisanvaani'")