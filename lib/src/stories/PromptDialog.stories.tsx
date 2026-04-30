import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/atoms/Button";
import {
  PromptDialog, ConfirmDialog,
  usePromptDialog, useConfirmDialog,
} from "../components/organisms/PromptDialog";

const meta: Meta = { title: "Organisms/PromptDialog & ConfirmDialog" };
export default meta;

export const Controlled: StoryObj = {
  name: "Controlled · Save as…",
  render: () => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState<string | null>(null);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Save as…</Button>
        {last && <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>Saved as: <strong>{last}</strong></p>}
        <PromptDialog
          open={open}
          title="Name this saved set"
          description="Give the working set a name so you can load it again later."
          inputLabel="Set name"
          placeholder="e.g. SOS targets — confirmed"
          validate={(v) => v.length < 2 ? "Name is too short" : v.length > 60 ? "Name is too long" : null}
          onSubmit={(v) => { setLast(v); setOpen(false); }}
          onCancel={() => setOpen(false)}
          confirmLabel="Save"
        />
      </>
    );
  },
};

export const ConfirmDestructive: StoryObj = {
  name: "Confirm · Delete saved set",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>Delete set</Button>
        <ConfirmDialog
          open={open}
          title='Delete "SOS targets"?'
          description="The saved set will be permanently removed from your working catalog. This cannot be undone."
          onConfirm={() => { alert("deleted"); setOpen(false); }}
          onCancel={() => setOpen(false)}
          tone="destructive"
          confirmLabel="Delete"
        />
      </>
    );
  },
};

export const Imperative: StoryObj = {
  name: "Imperative · usePromptDialog hook",
  render: () => {
    const [askName, nameDialog] = usePromptDialog();
    const [askConfirm, confirmDialog] = useConfirmDialog();
    const [output, setOutput] = useState("");

    const flow = async () => {
      const name = await askName({
        title: "Name this set",
        inputLabel: "Set name",
        placeholder: "e.g. araC arabinose response",
      });
      if (!name) { setOutput("Cancelled"); return; }
      const ok = await askConfirm({
        title: `Save as "${name}"?`,
        description: "Existing set with the same name will be overwritten.",
        confirmLabel: "Overwrite",
        tone: "destructive",
      });
      setOutput(ok ? `Saved as "${name}"` : "Save cancelled");
    };

    return (
      <>
        <Button onClick={flow}>Multi-step save flow</Button>
        {nameDialog}{confirmDialog}
        {output && <p style={{ marginTop: 12 }}>{output}</p>}
      </>
    );
  },
};
