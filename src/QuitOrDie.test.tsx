import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuitOrDie } from './App';

// Mock requestAnimationFrame and cancelAnimationFrame
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => {
    // For simple testing without deep canvas integration we don't necessarily want to call this forever,
    // but we can at least mock it to prevent issues.
    return setTimeout(cb, 16);
  }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));

  // Mock canvas
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});

describe('QuitOrDie', () => {
  it('renders initial start screen correctly', () => {
    const mockOnWin = vi.fn();
    render(<QuitOrDie onWin={mockOnWin} />);

    // Check main headings
    expect(screen.getByText('QUIT OR DIE')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Fast Food Warmup')).toBeInTheDocument();

    // Check initial score
    expect(screen.getByText('0')).toBeInTheDocument();

    // Check button
    expect(screen.getByRole('button', { name: /PLAY NOW/i })).toBeInTheDocument();
  });

  it('changes game state to PLAYING on click', () => {
    const mockOnWin = vi.fn();
    render(<QuitOrDie onWin={mockOnWin} />);

    const playButton = screen.getByRole('button', { name: /PLAY NOW/i });

    act(() => {
      fireEvent.click(playButton);
    });

    // Play button should be gone
    expect(screen.queryByRole('button', { name: /PLAY NOW/i })).not.toBeInTheDocument();

    // The instructions text from START should be gone
    expect(screen.queryByText(/Tap to jump. Dodge lasers/i)).not.toBeInTheDocument();
  });
});
