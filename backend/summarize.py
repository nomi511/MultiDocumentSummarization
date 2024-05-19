import sys
import json
import pandas as pd
import nltk
from nltk.corpus import stopwords
from transformers import BartForConditionalGeneration, BartTokenizer
from nltk.translate.bleu_score import corpus_bleu
from rouge_score import rouge_scorer

# Fix SSL certificate issue
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

# nltk.download('punkt')
# nltk.download('stopwords')

def load_documents_from_csv(csv_path):
    df = pd.read_csv(csv_path, dtype={'Unnamed: 4': str})
    return df['Unnamed: 4'].tolist()

def preprocess_documents(documents):
    processed_docs = []
    stop_words = set(stopwords.words('english'))
    for doc in documents:
        if isinstance(doc, str):
            filtered_words = [word for word in doc.split() if word.lower() not in stop_words]
            processed_docs.append(' '.join(filtered_words))
        else:
            processed_docs.append('')
    return processed_docs

def calculate_metrics(generated_summaries, reference_summaries):
    reference_summaries = [[ref.split()] for ref in reference_summaries]
    generated_summaries = [gen.split() for gen in generated_summaries]

    bleu_score = corpus_bleu(reference_summaries, generated_summaries)

    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    
    rouge1_recall = 0
    rouge1_precision = 0
    rouge1_fscore = 0
    rougeL_recall = 0
    rougeL_precision = 0
    rougeL_fscore = 0
    
    n = len(generated_summaries)
    for gen_sum, ref_sum in zip(generated_summaries, reference_summaries):
        scores = scorer.score(' '.join(gen_sum), ' '.join(ref_sum[0]))
        rouge1_recall += scores['rouge1'].recall
        rouge1_precision += scores['rouge1'].precision
        rouge1_fscore += scores['rouge1'].fmeasure
        rougeL_recall += scores['rougeL'].recall
        rougeL_precision += scores['rougeL'].precision
        rougeL_fscore += scores['rougeL'].fmeasure

    rouge1_recall /= n
    rouge1_precision /= n
    rouge1_fscore /= n
    rougeL_recall /= n
    rougeL_precision /= n
    rougeL_fscore /= n

    return bleu_score, rouge1_recall, rouge1_precision, rouge1_fscore, rougeL_recall, rougeL_precision, rougeL_fscore

if __name__ == '__main__':
    csv_path = sys.argv[1]
    num_summaries = int(sys.argv[2])

    documents = load_documents_from_csv(csv_path)
    limitDoc = documents[:num_summaries]

    processed_documents = preprocess_documents(limitDoc)

    model_name = 'facebook/bart-large-cnn'
    tokenizer = BartTokenizer.from_pretrained(model_name)
    model = BartForConditionalGeneration.from_pretrained(model_name)

    generated_summaries = []
    reference_summaries = [str(item) for item in limitDoc]

    for doc in processed_documents:
        inputs = tokenizer.encode("summarize: " + doc, return_tensors="pt", max_length=1024, truncation=True)
        summary_ids = model.generate(inputs, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        generated_summaries.append(summary)

    bleu_score, rouge1_recall, rouge1_precision, rouge1_fscore, rougeL_recall, rougeL_precision, rougeL_fscore = calculate_metrics(generated_summaries, reference_summaries)

    results = {
        "summaries": generated_summaries,
        "metrics": {
            "bleu_score": bleu_score,
            "rouge1_recall": rouge1_recall,
            "rouge1_precision": rouge1_precision,
            "rouge1_fscore": rouge1_fscore,
            "rougeL_recall": rougeL_recall,
            "rougeL_precision": rougeL_precision,
            "rougeL_fscore": rougeL_fscore
        }
    }

    print(json.dumps(results))
