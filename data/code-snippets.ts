export const vanillaJsCode = `const endpoint = "https://api.consentgrid.in/v1/consents";
const apiKey = "pk_live_your_publishable_key";

fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${apiKey}\`,
  },
  body: JSON.stringify({
    templateId: "tmpl_dpdp_onboarding_v2",
    principalId: "usr_1049",
    purposes: ["identity_verification", "service_notifications"],
    source: "web",
  }),
})
  .then((res) => {
    if (!res.ok) throw new Error(\`Request failed with \${res.status}\`);
    return res.json();
  })
  .then((data) => console.log("Consent saved:", data))
  .catch((err) => console.error("Consent API error:", err));`;

export const reactCode = `import { ConsentManager } from '@gridlines/react-sdk';

function App() {
  return (
    <ConsentManager 
      templateId="cm_12345678"
      onConsent={(data) => {
        console.log('User preferences:', data);
        // Add your logic here
      }}
    />
  );
}

export default App;`;

export const codeSnippetsData = [
  {
    title: "HTML / Vanilla JS",
    language: "HTML / Vanilla JS",
    code: vanillaJsCode,
  },
  {
    title: "React",
    language: "React",
    code: reactCode,
  },
];
