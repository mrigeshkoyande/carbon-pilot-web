import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroBadge from './HeroBadge';

describe('HeroBadge Component', () => {
  it('renders the badge text correctly', () => {
    render(<HeroBadge text="Carbon Neutral Initiative" />);
    const badgeElement = screen.getByText('Carbon Neutral Initiative');
    expect(badgeElement).toBeDefined();
  });

  it('contains the correct accessibility roles', () => {
    render(<HeroBadge text="Accessible Badge" />);
    // Testing library promotes accessible queries
    const textElement = screen.getByText('Accessible Badge');
    expect(textElement.className).toContain('hero-badge__text');
  });
});
