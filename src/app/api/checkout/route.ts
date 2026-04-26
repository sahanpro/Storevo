import { createOrder } from "@/actions/checkout";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const order = await createOrder(body);
    return Response.json(order);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
