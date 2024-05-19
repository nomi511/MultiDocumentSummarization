import React from 'react';

function SummaryResults({ summaries, metrics }) {
  return (
    <div className="summary-results">
      
      <div className='eval-mat summ'>

        <h2>Summaries</h2>
        <div className="summaries">
            {summaries.map((summary, index) => (
                <p key={index}>{summary}</p>
            ))}
        </div>

      </div>

      <div className='eval-mat mattr'>
        <h2>Evaluation Metrics</h2>
        <div className="summaries">
            <p>Bleu Score: <b>{metrics&&parseFloat(metrics?.bleu_score?.toFixed(4))}</b></p>
            <p>Recall: <b>{metrics&&parseFloat(metrics?.rouge1_recall?.toFixed(4))}</b><br></br> Precision: <b>{metrics&&parseFloat(metrics?.rouge1_precision?.toFixed(4))}</b><br></br> F-score: <b>{parseFloat(metrics&&metrics?.rouge1_fscore?.toFixed(4))}</b></p>
            {/* <p>ROUGE-L Recall: {metrics.rougeL_recall}, Precision: {metrics.rougeL_precision}, F-score: {metrics.rougeL_fscore}</p> */}
        </div>
      </div>
        
        
        
      
    </div>
  );
}

export default SummaryResults;
