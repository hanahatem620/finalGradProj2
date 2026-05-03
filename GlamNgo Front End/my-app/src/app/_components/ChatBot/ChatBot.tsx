'use client'

import Script from "next/script"

export default function ChatBot() {
  return (
    <>
    <div>
      <Script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></Script>
       {/* @ts-ignore */}
<df-messenger
  intent="WELCOME"
  chat-title="GlamNgo"
  agent-id="4b665990-94f2-47a3-8467-f7f053a8f5bf"
  language-code="en"
/>
    </div>
    
    </>
  )
}
