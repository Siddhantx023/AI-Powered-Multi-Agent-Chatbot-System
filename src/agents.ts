import { Agent, Message } from './types';

const simulateTyping = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

const analyzeContext = (messages: Message[]): string => {
  const lastMessages = messages.slice(-3);
  if (lastMessages.length === 0) return '';
  
  const topics = lastMessages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');
  
  return topics;
};

const getDefinitionFor = (topic: string): string => {
  const definitions: Record<string, string> = {
    'machine learning': `Machine learning is a branch of artificial intelligence (AI) that enables computers to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.

Key aspects include:
- Automated learning from data
- Pattern recognition
- Making decisions with minimal human intervention
- Continuous improvement over time`,
    
    'artificial intelligence': `Artificial Intelligence (AI) is the simulation of human intelligence by machines, particularly computer systems. It encompasses:
- Problem solving
- Learning from experience
- Understanding natural language
- Recognizing patterns and objects
- Making decisions based on data`,
    
    'deep learning': `Deep learning is a subset of machine learning based on artificial neural networks. It uses multiple layers of processing to:
- Extract higher-level features from raw input
- Learn complex patterns in large amounts of data
- Perform human-like tasks with high accuracy`,
    
    'neural network': `A neural network is a computing system inspired by biological brains. It consists of:
- Interconnected nodes (neurons)
- Multiple processing layers
- Ability to learn from training data
- Pattern recognition capabilities`,
  };

  const searchTopic = topic.toLowerCase();
  return definitions[searchTopic] || `Let me explain ${topic}. This is a complex topic that involves multiple aspects and practical applications. Would you like me to elaborate on any specific aspect?`;
};

const defaultResponse = async (message: string, context: Message[]): Promise<string> => {
  await simulateTyping();
  
  // Identify question patterns
  const whatMatch = message.match(/^what(?:\s+is|\s+are)?\s+(.+?)\??$/i);
  const isHowQuestion = /^how|how to|how do/i.test(message);
  const isWhyQuestion = /^why|why is|why do/i.test(message);
  
  // Handle "What is X?" questions with definitions
  if (whatMatch) {
    const topic = whatMatch[1].trim();
    const definition = getDefinitionFor(topic);
    
    return `${definition}

Would you like to know more about:
1. Practical applications
2. Real-world examples
3. Latest developments
4. Getting started with ${topic}`;
  }
  
  if (isHowQuestion) {
    return `I'll help you understand how to do this.

Here's a step-by-step guide for "${message}":

1. First, let's understand the goal
   - Define your objectives
   - Identify requirements
   - Set clear expectations

2. Here are the steps needed
   - Break down the process
   - Gather necessary resources
   - Follow best practices

3. Important considerations
   - Common challenges
   - Required prerequisites
   - Time and resource requirements

4. Common pitfalls to avoid
   - Typical mistakes
   - Solutions to problems
   - Optimization tips

Would you like me to explain any step in more detail?`;
  }
  
  if (isWhyQuestion) {
    return `I'll explain the reasoning behind this.

Regarding "${message}":

1. Background Context
   - Historical perspective
   - Current situation
   - Relevant factors

2. Main Reasons
   - Primary factors
   - Key motivations
   - Core benefits

3. Supporting Evidence
   - Research findings
   - Expert opinions
   - Case studies

4. Practical Implications
   - Real-world impact
   - Future considerations
   - Action items

Would you like me to expand on any of these points?`;
  }
  
  return `I understand you're interested in "${message}". Let me help you with that:

1. Key Information
   - Core concepts
   - Important principles
   - Fundamental aspects

2. Relevant Details
   - Specific examples
   - Implementation details
   - Best practices

3. Next Steps
   - Practical applications
   - Learning resources
   - Further exploration

What specific aspect would you like to know more about?`;
};

const technicalResponse = async (message: string, context: Message[]): Promise<string> => {
  await simulateTyping();
  
  const codePattern = /code|programming|javascript|python|react|api|function|component|database|algorithm/i;
  const isCodeRelated = codePattern.test(message);
  
  if (isCodeRelated) {
    return `\`\`\`markdown
# Technical Analysis

## Understanding Your Query
"${message}"

## Key Components
1. Technical Requirements
   - System dependencies
   - Environment setup
   - Required libraries

2. Implementation Approach
   - Architecture overview
   - Design patterns
   - Best practices

3. Code Example
   - Sample implementation
   - Key functions
   - Error handling

## Sample Implementation
\`\`\`javascript
// Here's a practical example
function demonstration() {
  try {
    // Implementation details based on your query
    const result = processQuery("${message}");
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to process query");
  }
}

// Helper function
function processQuery(query) {
  // Query processing logic
  return \`Processed: \${query}\`;
}
\`\`\`

## Best Practices
1. Code Organization
   - Modular structure
   - Clean architecture
   - Documentation

2. Performance Considerations
   - Optimization techniques
   - Resource management
   - Scalability

3. Error Handling
   - Exception management
   - Logging
   - Recovery strategies

4. Testing Approach
   - Unit tests
   - Integration tests
   - Performance testing

Would you like me to elaborate on any of these aspects?
\`\`\``;
  }
  
  return `# Technical Perspective

## Analysis of "${message}"

1. System Architecture Considerations
   - Performance implications
     * Resource usage
     * Scalability factors
     * Response times
   - Security considerations
     * Data protection
     * Access control
     * Vulnerability prevention

2. Implementation Strategy
   - Recommended approach
     * Technology stack
     * Design patterns
     * Best practices
   - Alternative solutions
     * Pros and cons
     * Trade-offs
     * Cost considerations

3. Next Steps
   - Implementation plan
     * Phase 1: Setup
     * Phase 2: Development
     * Phase 3: Testing
   - Deployment strategy
     * Environment setup
     * CI/CD pipeline
     * Monitoring

Which aspect would you like me to explain in more detail?`;
};

const creativeResponse = async (message: string, context: Message[]): Promise<string> => {
  await simulateTyping();
  
  const themes = message.split(' ')
    .filter(word => word.length > 3)
    .map(word => word.toLowerCase());
  
  const moodWords = {
    positive: ['exciting', 'innovative', 'inspiring', 'creative', 'dynamic'],
    thoughtful: ['interesting', 'complex', 'nuanced', 'detailed', 'profound'],
    practical: ['useful', 'effective', 'efficient', 'practical', 'valuable']
  };
  
  const randomWord = (array: string[]) => array[Math.floor(Math.random() * array.length)];
  
  return `🌟 Creative Exploration: "${message}" 🌟

Let's explore this ${randomWord(moodWords.positive)} topic together!

🎯 Key Themes:
${themes.map(theme => `* ${theme.charAt(0).toUpperCase() + theme.slice(1)}: A ${randomWord(moodWords.thoughtful)} perspective
  - Exploring the boundaries
  - Innovative approaches
  - Unique interpretations\n`).join('')}

💡 Creative Directions:
1. ${randomWord(moodWords.positive).charAt(0).toUpperCase() + randomWord(moodWords.positive).slice(1)} Approach
   - Breaking conventional patterns
   - Exploring new possibilities
   - Combining different elements

2. ${randomWord(moodWords.thoughtful).charAt(0).toUpperCase() + randomWord(moodWords.thoughtful).slice(1)} Perspective
   - Deep analysis
   - Hidden connections
   - Alternative viewpoints

3. ${randomWord(moodWords.practical).charAt(0).toUpperCase() + randomWord(moodWords.practical).slice(1)} Applications
   - Real-world implementation
   - Practical benefits
   - Measurable outcomes

🔍 Detailed Exploration:
${themes.map((theme, index) => `
${index + 1}. ${theme.charAt(0).toUpperCase() + theme.slice(1)}
   - Unique aspects to consider
     * Novel interpretations
     * Unexpected connections
     * Fresh perspectives
   - Creative possibilities
     * Innovative applications
     * Cross-disciplinary approaches
     * Future potential
   - Practical applications
     * Real-world usage
     * Implementation ideas
     * Success metrics`).join('\n')}

Which aspect would you like to explore further?`;
};

export const agents: Agent[] = [
  {
    name: 'General Assistant',
    description: 'A helpful general-purpose assistant that provides clear, structured responses',
    icon: 'user',
    handleMessage: defaultResponse,
    expertise: ['General Knowledge', 'Clear Explanations', 'Structured Responses', 'Practical Advice'],
    greeting: "Hello! I'm your general assistant. I provide clear, structured responses to help you better understand any topic. How can I assist you today?",
  },
  {
    name: 'Technical Expert',
    description: 'Specialized in technical explanations with code examples and best practices',
    icon: 'code',
    handleMessage: technicalResponse,
    expertise: ['Programming', 'System Design', 'Code Examples', 'Best Practices', 'Technical Analysis'],
    greeting: "Welcome! I'm your technical expert. I provide detailed technical explanations with code examples and best practices. What technical challenge can I help you with?",
  },
  {
    name: 'Creative Mind',
    description: 'Offers creative and imaginative responses with structured exploration of ideas',
    icon: 'sparkles',
    handleMessage: creativeResponse,
    expertise: ['Brainstorming', 'Creative Writing', 'Idea Generation', 'Conceptual Exploration'],
    greeting: "Greetings! I'm your creative companion. I help explore ideas and concepts in unique and structured ways. What creative journey shall we embark on?",
  },
];