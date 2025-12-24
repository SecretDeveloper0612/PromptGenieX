import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
          <Shield className="text-purple-400 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-4xl font-black font-satoshi tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 font-medium">Last updated: May 2024</p>
        </div>
      </div>

      <div className="glass p-10 rounded-[3rem] border-white/5 space-y-12 text-gray-400 leading-relaxed font-medium">
        <section>
          <h2 className="text-2xl font-black font-satoshi text-white mb-4">1. Data Sovereignty</h2>
          <p>
            At PromptGenieX, we believe your ideas are your most valuable asset. We do not use your generated prompts or inputs to train our global models. All "engineering" happens in isolated inference environments that purge data immediately after a session ends.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black font-satoshi text-white mb-4">2. Information Collection</h2>
          <p>
            We collect minimal data required to provide our service: email address for authentication, billing information for Pro/Agency tiers, and local vault history (encrypted on your device).
          </p>
          <ul className="list-disc ml-6 mt-4 space-y-2">
            <li>Authentication: Email and password (salted/hashed)</li>
            <li>Usage: Metadata about prompt length and engine type</li>
            <li>Billing: Handled securely via Stripe (we do not store CC numbers)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black font-satoshi text-white mb-4">3. Security Standards</h2>
          <p>
            PromptGenieX employs AES-256 encryption for all data at rest and TLS 1.3 for all data in transit. Your Private Vault is further secured using client-side encryption keys derived from your session token.
          </p>
        </section>

        <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex gap-6 items-start">
          <Lock className="text-purple-400 w-6 h-6 shrink-0 mt-1" />
          <p className="text-sm">
            Our commitment to privacy is absolute. We undergo quarterly security audits to ensure your proprietary prompt patterns remain strictly confidential.
          </p>
        </div>
      </div>
    </div>
  );
};