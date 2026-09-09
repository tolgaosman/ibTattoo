"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
    };
  }
}

// Google Translate rewrites text nodes directly in the DOM. When React later
// re-renders that subtree it can try to remove/insert nodes Google has
// already moved, throwing "Failed to execute 'removeChild'/'insertBefore'"
// and crashing the app. Patch both to no-op when the node isn't actually a
// child/sibling anymore instead of throwing.
function patchDomForTranslate() {
  if ((window as unknown as { __gtDomPatched?: boolean }).__gtDomPatched) return;
  (window as unknown as { __gtDomPatched?: boolean }).__gtDomPatched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export function GoogleTranslate() {
  useEffect(() => {
    patchDomForTranslate();

    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "tr", includedLanguages: "tr,en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Kept in the DOM but visually hidden — LanguageSwitcher drives the real
  // <select> Google renders inside it programmatically.
  return <div id="google_translate_element" className="hidden" />;
}
