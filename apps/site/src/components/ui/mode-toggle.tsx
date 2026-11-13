import { useColorMode } from "@kobalte/core";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

function Sun(props: { class: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      />
    </svg>
  );
}

function Moon(props: { class: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"
      />
    </svg>
  );
}

function Auto(props: { class: string }) {
  return (
    <svg class={props.class} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="2" />
      <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 20h8M12 16v4" />
    </svg>
  );
}

export default function ModeToggle() {
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="sm"
        class="theme-trigger relative w-9 px-0"
        aria-label="Theme"
      >
        <Sun class="theme-icon theme-icon--light" />
        <Moon class="theme-icon theme-icon--dark" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <Sun class="theme-glyph" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <Moon class="theme-glyph" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <Auto class="theme-glyph" />
          <span>Auto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
