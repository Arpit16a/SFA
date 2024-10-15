import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_from_disk

def tokenize_function(examples, tokenizer):
    full_texts = [f"{input}{tokenizer.eos_token}{output}" for input, output in zip(examples['input'], examples['output'])]
    tokenized = tokenizer(full_texts, truncation=True, padding="max_length", max_length=256)
    tokenized["labels"] = tokenizer(examples['output'], truncation=True, padding="max_length", max_length=256)["input_ids"]
    return tokenized

def train_personalized_model(model_path, output_dir, num_epochs):
    # Load the pre-trained model and tokenizer
    model = AutoModelForCausalLM.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    tokenizer.pad_token = tokenizer.eos_token

    # Load and tokenize the personalized dataset
    dataset = load_from_disk("processed_personalized_dataset")
    tokenized_dataset = dataset.map(lambda x: tokenize_function(x, tokenizer), batched=True, remove_columns=dataset.column_names)

    # Set up training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=num_epochs,
        per_device_train_batch_size=4,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        use_cpu=True,
    )

    # Create Trainer instance and train
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
    )
    trainer.train()

    # Save the fine-tuned model
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    print(f"Fine-tuning complete. Model saved to '{output_dir}'")

if __name__ == "__main__":
    huggingface_model_path = "./fine_tuned_dialogpt_kisanvaani"  # Path to your pre-trained Hugging Face model
    personalized_model_path = "./fine_tuned_model_personalized"
    train_personalized_model(huggingface_model_path, personalized_model_path, num_epochs=3)