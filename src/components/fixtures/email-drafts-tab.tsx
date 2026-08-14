"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import {
  buildInviteEmail,
  buildItineraryEmail,
  buildMenuEmail,
  type EmailDraft,
} from "@/lib/email-templates";
import type { FixtureDetail } from "@/lib/queries/fixture-detail";

type DraftType = "invite" | "itinerary" | "menu";

const BUILDERS: Record<DraftType, typeof buildInviteEmail> = {
  invite: buildInviteEmail,
  itinerary: buildItineraryEmail,
  menu: buildMenuEmail,
};

function DraftEditor({
  detail,
  type,
  hostName,
}: {
  detail: FixtureDetail;
  type: DraftType;
  hostName: string;
}) {
  const assignedSeats = useMemo(
    () => detail.seats.filter((s) => s.guest),
    [detail.seats],
  );

  const [selectedGuestId, setSelectedGuestId] = useState<string>("all");

  const selectedSeat = assignedSeats.find((s) => s.guest?.id === selectedGuestId) ?? null;

  const draft: EmailDraft = useMemo(() => {
    const builder = BUILDERS[type];
    return builder({
      fixture: detail.fixture,
      settings: detail.settings,
      menu: detail.menu,
      guest: selectedSeat?.guest ?? null,
      seatLabel: selectedSeat?.label ?? null,
      arrivalTime: selectedSeat?.allocation?.arrival_time?.slice(0, 5) ?? null,
      hostName: selectedSeat?.allocation?.host_name || hostName,
    });
  }, [type, selectedSeat, detail, hostName]);

  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [lastKey, setLastKey] = useState(`${type}-all`);

  const key = `${type}-${selectedGuestId}`;
  if (key !== lastKey) {
    setSubject(draft.subject);
    setBody(draft.body);
    setLastKey(key);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 justify-between">
        <div className="space-y-1.5">
          <Label>To</Label>
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {assignedSeats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No guests assigned to this fixture yet.</p>
            ) : (
              assignedSeats.map((s) => (
                <span key={s.id} className="text-xs bg-muted rounded-full px-2.5 py-1">
                  {s.guest!.name}
                  {s.guest!.email ? ` <${s.guest!.email}>` : " (no email on file)"}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="space-y-1.5 w-56">
          <Label>Personalise for</Label>
          <Select value={selectedGuestId} onValueChange={(v) => setSelectedGuestId(v ?? "all")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assigned guests</SelectItem>
              {assignedSeats.map((s) => (
                <SelectItem key={s.id} value={s.guest!.id}>
                  {s.guest!.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={`subject-${type}`}>Subject</Label>
          <Input id={`subject-${type}`} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`body-${type}`}>Body</Label>
          <Textarea
            id={`body-${type}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            className="font-mono text-sm"
          />
        </div>
        <Button onClick={copyToClipboard} variant="outline">
          <Copy className="size-4" />
          Copy to Clipboard
        </Button>
      </Card>
    </div>
  );
}

export function EmailDraftsTab({ detail, hostName }: { detail: FixtureDetail; hostName: string }) {
  return (
    <Tabs defaultValue="invite">
      <TabsList>
        <TabsTrigger value="invite">Invite</TabsTrigger>
        <TabsTrigger value="itinerary">Match Day Itinerary</TabsTrigger>
        <TabsTrigger value="menu">Menu Email</TabsTrigger>
      </TabsList>
      <TabsContent value="invite">
        <DraftEditor detail={detail} type="invite" hostName={hostName} />
      </TabsContent>
      <TabsContent value="itinerary">
        <DraftEditor detail={detail} type="itinerary" hostName={hostName} />
      </TabsContent>
      <TabsContent value="menu">
        <DraftEditor detail={detail} type="menu" hostName={hostName} />
      </TabsContent>
    </Tabs>
  );
}
