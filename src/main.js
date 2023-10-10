const PUBLIC_VAPID_KEY =
  "BCn6Viuh_FiAEB5yWV6fcbJ6MzvsfN2UfH8qqqFJqDzbdB0XuJbCZVGq7kACs73KXc428ahPanLfQ9ko6q0DQXY";

const subscription = async () => {
  // Service Worker
  console.log("Registering a Service worker");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/"
  });
  console.log("New Service Worker");}
  // Service Worker Support
if ("serviceWorker" in navigator) {
    subscription().catch(err => console.log(err));
  }