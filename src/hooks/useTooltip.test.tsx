import { describe, expect, it } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import { useTooltip, Tooltip } from './useTooltip';

describe('useTooltip', () => {
  describe('initial state', () => {
    it('should have null state initially', () => {
      const { result } = renderHook(() => useTooltip());
      expect(result.current.state).toBeNull();
    });
  });

  describe('show', () => {
    it('should update state with label and centered position', () => {
      const { result } = renderHook(() => useTooltip());

      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 200,
          width: 50,
          height: 30,
          right: 150,
          bottom: 230,
          x: 100,
          y: 200,
          toJSON: () => {},
        }),
      } as HTMLElement;

      act(() => {
        result.current.show('Test Label', mockElement);
      });

      expect(result.current.state).not.toBeNull();
      expect(result.current.state?.label).toBe('Test Label');
      expect(result.current.state?.x).toBe(125); // left + width/2
      expect(result.current.state?.y).toBe(192); // top - 8
    });

    it('should always center on element (clamping is handled by Tooltip component)', () => {
      const { result } = renderHook(() => useTooltip());

      const mockElement = {
        getBoundingClientRect: () => ({
          left: 180,
          top: 100,
          width: 20,
          height: 30,
          right: 200,
          bottom: 130,
          x: 180,
          y: 100,
          toJSON: () => {},
        }),
      } as HTMLElement;

      act(() => {
        result.current.show('Long Label Text', mockElement);
      });

      // Hook always returns the raw centered position
      expect(result.current.state?.x).toBe(190); // left + width/2
    });
  });

  describe('hide', () => {
    it('should set state to null', () => {
      const { result } = renderHook(() => useTooltip());

      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 200,
          width: 50,
          height: 30,
          right: 150,
          bottom: 230,
          x: 100,
          y: 200,
          toJSON: () => {},
        }),
      } as HTMLElement;

      act(() => {
        result.current.show('Test', mockElement);
      });

      expect(result.current.state).not.toBeNull();

      act(() => {
        result.current.hide();
      });

      expect(result.current.state).toBeNull();
    });
  });

  describe('function stability', () => {
    it('should return stable show and hide functions', () => {
      const { result, rerender } = renderHook(() => useTooltip());

      const showFn1 = result.current.show;
      const hideFn1 = result.current.hide;

      rerender();

      expect(result.current.show).toBe(showFn1);
      expect(result.current.hide).toBe(hideFn1);
    });
  });
});

describe('Tooltip component', () => {
  it('should render tooltip content via portal', () => {
    const { unmount } = render(<Tooltip label="Test Tooltip" x={100} y={200} />);

    expect(screen.getByText('Test Tooltip')).toBeInTheDocument();

    unmount();
  });

  it('should have correct positioning styles', () => {
    const { unmount } = render(<Tooltip label="Test" x={150} y={250} />);

    const tooltip = document.querySelector('.snow-action-tooltip') as HTMLElement;
    expect(tooltip).not.toBeNull();
    expect(tooltip.style.position).toBe('fixed');
    expect(tooltip.style.left).toBe('150px');
    expect(tooltip.style.top).toBe('250px');
    expect(tooltip.style.zIndex).toBe('50');

    unmount();
  });

  it('should render tooltip content and arrow', () => {
    const { unmount } = render(<Tooltip label="My Label" x={100} y={100} />);

    expect(document.querySelector('.snow-tooltip-content')).toBeInTheDocument();
    expect(document.querySelector('.snow-tooltip-arrow')).toBeInTheDocument();

    unmount();
  });
});
