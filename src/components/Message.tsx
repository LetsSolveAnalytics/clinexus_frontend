import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Settings, Image as ImgIcon, Paperclip, Send } from "lucide-react";

const doctors = [
  {
    name: "Dr. Smith",
    time: "10:52 am",
    preview: "Could you please review the latest MRI re...",
    unread: true,
  },
  {
    name: "Dr. Johnson",
    time: "Yesterday",
    preview: "The biopsy results are in. I'll forward them...",
    unread: true,
  },
  {
    name: "Dr. Lee",
    time: "Yesterday",
    preview: "I've updated the patient's treatment plan...",
    unread: true,
  },
  {
    name: "Dr. Patel",
    time: "Yesterday",
    preview: "Hi Dr. Patel, I have a 50-year-old...",
    unread: false,
  },
  {
    name: "Dr. Chen",
    time: "03/02/2025",
    preview: "I've scheduled a follow-up for the post...",
    unread: false,
  },
  {
    name: "Dr. Williams",
    time: "03/02/2025",
    preview: "I need a quick consultation on a rare con...",
    unread: false,
  },
];

const initialChat = [
  {
    from: "them",
    time: "Yesterday, 3:00 PM",
    text: "Hi Dr. Patel, I have a 50-year-old patient presenting with mild dizziness and occasional headaches.",
  },
  {
    from: "them",
    text: "Their blood pressure is slightly elevated, but everything else looks fine. Could this be something serious, or should I just monitor it?",
  },
  {
    from: "me",
    text: "Hi Dr. Lauri, sounds like it could be related to mild hypertension. I'd suggest monitoring their blood pressure more closely and maybe adjusting their diet and exercise routine. If the symptoms persist, we could consider further tests.",
  },
  {
    from: "them",
    text: "Thanks, Dr. Patel. I’ll keep monitoring and advise the patient on lifestyle changes. I’ll let you know if anything changes.",
  },
  {
    from: "me",
    text: "No problem, let me know if you need anything else.",
  },
];

export default function Messages() {
  const [active, setActive] = useState(3); // Dr. Patel selected
  const [chat, setChat] = useState(initialChat);
  const [msg, setMsg] = useState("");

  const sendMessage = () => {
    if (!msg.trim()) return;
    setChat([...chat, { from: "me", text: msg }]);
    setMsg("");
  };

  return (
    <div className="p-8 bg-[#E7F1F7] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1B3A65]">Messages</h1>
        </div>

        {/* Search */}
        <div className="relative w-96">
          <Input
            placeholder="Search"
            className="pl-10 rounded-full bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* LEFT PANEL – Doctors list */}
        <Card className="col-span-1 bg-white p-4 rounded-2xl shadow-sm max-h-[80vh] overflow-y-auto">
          {doctors.map((d, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`p-4 rounded-xl mb-3 cursor-pointer border ${
                active === i
                  ? "bg-blue-200/40 border-blue-300"
                  : d.unread
                  ? "bg-red-100/40 border-red-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex justify-between text-sm font-semibold">
                <span>{d.name}</span>
                <span className="text-gray-500">{d.time}</span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {d.preview}
              </div>
            </div>
          ))}
        </Card>

        {/* RIGHT PANEL – Chat */}
        <Card className="col-span-3 bg-white p-6 rounded-2xl shadow-sm flex flex-col">
          
          {/* Chat header */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src="/icons/user-pp.svg"
              className="h-10 w-10 rounded-full"
            />
            <h2 className="text-xl font-semibold text-[#1B3A65]">
              {doctors[active].name}
            </h2>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {chat.map((m, i) => (
              <div
                key={i}
                className={`max-w-lg p-3 rounded-xl text-sm ${
                  m.from === "me"
                    ? "bg-[#DFF0FF] ml-auto"
                    : "bg-[#E7F7FF] mr-auto"
                }`}
              >
                {m.time && (
                  <div className="text-[10px] text-gray-500 mb-1">
                    {m.time}
                  </div>
                )}
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-3 border-t pt-3">
            <Input
              placeholder="Type a message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 rounded-full bg-[#F3F6FA] px-5"
            />

            <ImgIcon className="cursor-pointer text-slate-500" />
            <Paperclip className="cursor-pointer text-slate-500" />

            <button
              onClick={sendMessage}
              className="bg-[#1D5BFF] text-white p-3 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
