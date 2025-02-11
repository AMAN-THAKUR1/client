const Message = ({ message, isOwn }) => {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] p-3 rounded-lg ${
          isOwn 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : 'bg-white text-gray-900 rounded-bl-none'
        }`}>
          <p className="text-sm">{message.content}</p>
          <span className="text-xs opacity-75 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  };
  
  export default Message;