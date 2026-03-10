import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Sparkles, TrendingDown, Shield, Server, Database, Send } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    type: 'cost',
    title: 'Resize Compute Instance',
    issue: 'VM instance "vm-web-server-01" is overprovisioned',
    explanation: 'Analysis shows CPU utilization averaging 18% over the last 30 days. Current instance type (n1-standard-8) is significantly larger than needed for the workload.',
    action: 'Downgrade to n1-standard-4 instance type',
    impact: '$380/month savings',
    confidence: 92,
  },
  {
    id: 2,
    type: 'security',
    title: 'Make Storage Bucket Private',
    issue: 'Storage bucket "prod-assets" is publicly accessible',
    explanation: 'Public access to storage buckets can lead to data breaches and unauthorized access. This bucket contains sensitive application data that should not be publicly accessible.',
    action: 'Set bucket policy to private and configure IAM-based access',
    impact: 'High security improvement',
    confidence: 98,
  },
  {
    id: 3,
    type: 'cost',
    title: 'Delete Idle Virtual Machine',
    issue: 'VM "vm-staging-db-02" has been idle for 45 days',
    explanation: 'This VM shows no network traffic, CPU usage below 2%, and no active connections. It appears to be a forgotten staging environment from a previous project.',
    action: 'Create snapshot and delete the VM instance',
    impact: '$520/month savings',
    confidence: 96,
  },
  {
    id: 4,
    type: 'cost',
    title: 'Optimize Database Tier',
    issue: 'Database "db-analytics" is on premium tier with low utilization',
    explanation: 'Current database tier supports 10,000 IOPS but actual usage averages 800 IOPS. Downgrading to standard tier will meet performance needs at lower cost.',
    action: 'Migrate to standard database tier',
    impact: '$290/month savings',
    confidence: 87,
  },
  {
    id: 5,
    type: 'security',
    title: 'Enable Database Encryption',
    issue: 'Database "db-user-data" is not encrypted at rest',
    explanation: 'Sensitive user data stored without encryption violates security best practices and compliance requirements. Encryption at rest protects against unauthorized physical access.',
    action: 'Enable Cloud KMS encryption for database',
    impact: 'Critical security improvement',
    confidence: 99,
  },
  {
    id: 6,
    type: 'cost',
    title: 'Use Committed Use Discounts',
    issue: 'Stable workloads running on on-demand instances',
    explanation: 'Your compute instances have been running consistently for 6+ months. Committed use contracts offer significant discounts for stable workloads.',
    action: 'Purchase 1-year committed use contract for production VMs',
    impact: '$1,200/month savings',
    confidence: 94,
  },
];

const exampleQuestions = [
  'Why is my cloud cost increasing?',
  'What security risks exist?',
  'How can I optimize my infrastructure?',
  'Show me cost trends for compute resources',
];

export function AIRecommendations() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Infra AI, your cloud optimization assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);

    setInputValue('');
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="AI Optimization Recommendations" />
        <main className="flex-1 overflow-hidden flex gap-6 p-8">
          {/* Left Side - Recommendations */}
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-semibold text-white">AI-Powered Recommendations</h2>
              </div>
              <p className="text-slate-400">Intelligent suggestions to optimize your cloud infrastructure</p>
            </div>

            <div className="space-y-6">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>

          {/* Right Side - AI Assistant Chat */}
          <div className="w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-6 border-b border-emerald-500/20 bg-gradient-to-r from-slate-950 to-emerald-950/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Infra AI</h3>
                  <p className="text-xs text-emerald-400">Your Cloud Assistant</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-slate-200 border border-white/10'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Example Questions */}
            <div className="p-4 border-t border-slate-800">
              <p className="text-xs text-slate-400 mb-2">Example questions:</p>
              <div className="space-y-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[var(--color-accent-green)] rounded text-xs transition-all border border-white/10 hover:border-[var(--color-accent-green)]/30"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything about your infrastructure..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-accent-green)] transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-500/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: typeof recommendations[0] }) {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'cost':
        return <TrendingDown className="w-6 h-6" />;
      case 'security':
        return <Shield className="w-6 h-6" />;
      default:
        return <Server className="w-6 h-6" />;
    }
  };

  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'cost':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'security':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--color-accent-green)]/40 transition-all shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{recommendation.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{recommendation.issue}</p>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <h4 className="text-sm font-semibold text-emerald-400 mb-2">Explanation</h4>
        <p className="text-sm text-slate-300">{recommendation.explanation}</p>
      </div>

      {/* Recommended Action */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <h4 className="text-sm font-semibold text-emerald-400 mb-2">Recommended Action</h4>
        <p className="text-sm text-white">{recommendation.action}</p>
      </div>

      {/* Impact and Confidence */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
          <div className="text-xs text-emerald-400 mb-1">
            {recommendation.type === 'cost' ? 'Estimated Savings' : 'Security Impact'}
          </div>
          <div className="text-lg font-bold text-white">{recommendation.impact}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">Confidence Score</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-white">{recommendation.confidence}%</div>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${recommendation.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-[var(--color-accent-green)]/50 rounded-lg transition-all font-medium">
          Simulate Impact
        </button>
        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-lg transition-all font-medium shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50">
          Apply Fix
        </button>
      </div>
    </div>
  );
}

function generateAIResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('cost') && lowerQuestion.includes('increasing')) {
    return 'Your cloud costs have increased by 8.2% this month, primarily due to: (1) New compute instances added to handle increased traffic (+$800), (2) Storage growth from logging and backups (+$400), and (3) Data transfer costs (+$200). I recommend reviewing the Cost Optimization page for detailed savings opportunities totaling $2,420/month.';
  }

  if (lowerQuestion.includes('security') && lowerQuestion.includes('risk')) {
    return 'I\'ve detected 7 security risks across your infrastructure: 3 critical issues (public storage buckets, unencrypted database), 2 high-severity risks (open firewall ports), and 2 medium-severity issues. Your current security score is 68/100. The most urgent fix is securing the "storage-bucket-backups" which is publicly accessible.';
  }

  if (lowerQuestion.includes('optimize') || lowerQuestion.includes('infrastructure')) {
    return 'Based on my analysis, here are the top 3 optimization opportunities: (1) Delete idle VM "vm-staging-db-02" for $520/month savings, (2) Resize overprovisioned instances for $380/month savings, and (3) Purchase committed use discounts for $1,200/month savings. Together, these could reduce your costs by 17.5%.';
  }

  if (lowerQuestion.includes('compute') || lowerQuestion.includes('trend')) {
    return 'Your compute costs have grown from $5,290 to $6,210 over the last 3 months (+17%). Main drivers: 3 new production VMs added in January, increased usage on existing instances, and lack of committed use discounts. I recommend consolidating workloads and switching to committed use contracts.';
  }

  return 'I can help you with cost optimization, security recommendations, and infrastructure analysis. Try asking about specific resources, cost trends, or security risks. You can also use the example questions below for guidance.';
}
