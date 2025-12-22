import type { Metadata } from 'next';
import { ResumePage } from './ResumePage';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Professional resume and qualifications.',
};

export default function Resume() {
  return <ResumePage />;
}
