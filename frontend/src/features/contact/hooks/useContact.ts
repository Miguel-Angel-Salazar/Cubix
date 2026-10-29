import { ContactMessage, submitContactMessage } from "../services/contact.service";

export function useContact() {
  return {
    sendContactMessage: (message: ContactMessage) => submitContactMessage(message),
  };
}