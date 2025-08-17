import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Zap } from "lucide-react";

interface QuickAccessProps {
  patientData: {
    id: number;
    name: string;
    type: string;
  };
}

const QuickAccess = ({ patientData }: QuickAccessProps) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ type: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What are the current medications for this patient?",
    "Any drug allergies or interactions to note?",
    "What was the last visit summary?",
    "Are there any pending lab results?",
    "What is the patient's medical history?",
    "Any upcoming appointments scheduled?"
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response - replace with actual FastAPI integration
    setTimeout(() => {
      const mockResponse = `Based on ${patientData.name}'s records in ${patientData.type}, here's the information you requested. This would be connected to your FastAPI backend to fetch real patient data and provide intelligent responses.`;
      setChatMessages(prev => [...prev, { type: 'assistant', content: mockResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Quick Access
          <Badge variant="outline" className="ml-2">
            AI Assistant
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about {patientData.name} to get instant insights
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="h-64 bg-muted/20 rounded-lg border border-border/30 p-4 overflow-y-auto space-y-3">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation about this patient</p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border/50'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background border border-border/50 rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about this patient..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Suggested Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs h-8 px-3"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;