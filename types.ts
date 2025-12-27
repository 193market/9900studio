import React from 'react';

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

export interface InquiryFormState {
  name: string;
  contact: string;
  category: 'product' | 'real_estate' | 'avatar' | 'other';
  message: string;
}

export enum SectionId {
  HERO = 'hero',
  SAMPLES = 'samples',
  PROBLEM = 'problem',
  SOLUTION = 'solution',
  SERVICES = 'services',
  PRICING = 'pricing',
  PROCESS = 'process',
  TRUST = 'trust',
  DEMO = 'demo',
  CONTACT = 'contact',
}