// import { Sandbox } from "@e2b/code-interpreter";
import { Sandbox } from 'e2b'


export async function getSandBox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}
