import { NextRequest, NextResponse } from "next/server";
import { ollama, defaultModel } from "@/lib/ollama";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message 필드가 필요합니다." },
        { status: 400 }
      );
    }

    const completion = await ollama.chat.completions.create({
      model: defaultModel,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Respond in Korean unless the user asks in another language.",
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ?? "응답을 생성하지 못했습니다.";

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const isConnection =
      message.includes("ECONNREFUSED") ||
      message.includes("fetch failed") ||
      message.includes("localhost:11434");

    if (isConnection) {
      return NextResponse.json(
        {
          error:
            "Ollama 서버에 연결할 수 없습니다. localhost:11434에서 Ollama가 실행 중인지 확인하고, 터미널에서 'ollama serve' 또는 'ollama run llama3.2'를 실행해 보세요.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "채팅 처리 중 오류: " + message },
      { status: 500 }
    );
  }
}
