export interface Credential {
  id: string;
  site: string;
  url: string;
  user: string;
  pass: string;
}

export interface EncryptedCredential {
  id: string;
  site: string; // encrypted
  url: string; // encrypted
  user: string; // encrypted
  pass: string; // encrypted
}

export interface CannedMessage {
  id: string;
  title: string;
  body: string;
}

export interface EncryptedCannedMessage {
  id: string;
  title: string; // encrypted
  body: string; // encrypted
}
