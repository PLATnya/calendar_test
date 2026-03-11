'use client';

import styled, { css, keyframes } from 'styled-components';

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Main Container
export const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 12px;

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

export const MainContainer = styled.main`
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface}dd;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  backdrop-filter: blur(8px);
  overflow: scroll;
  @media (min-width: 640px) {
    height: calc(100vh - 32px);
    padding: 24px;
  }
`;

// Loading Overlay
export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.surface}cc;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.accent.light};
  border-top-color: ${({ theme }) => theme.colors.accent.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
`;

// Header Section
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (min-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

export const FilterInput = styled.input`
  padding: 6px 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.light};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Navigation Buttons
export const NavButton = styled.button`
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.hover};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

// Calendar Grid Section
export const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const WeekDayHeader = styled.div`
  padding: 8px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  @media (min-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 4px;
  flex: 1;
  max-height: 180px;
  position: relative;

  @media (min-width: 640px) {
    gap: 4px;
  }
`;

// Empty cell (no day)
export const EmptyCell = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid transparent;
  background: transparent;
`;

// Day cell (has a day)
interface DayCellProps {
  $isToday: boolean;
  $isDragOver: boolean;
  $isSelected: boolean;
}

export const DayCell = styled.div<DayCellProps>`
  position: relative;
  flex-direction: column;
  padding: 8px;
  height: 180px;
  overflow-y: scroll;

  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      border: 1px solid ${theme.colors.today.border};
      background: ${theme.colors.today.background};
      color: ${theme.colors.today.text};
    `}

  ${({ $isToday, $isDragOver, theme }) =>
    !$isToday &&
    $isDragOver &&
    css`
      border: 2px solid ${theme.colors.accent.primary};
      background: ${theme.colors.accent.light};
      box-shadow: 0 0 0 2px ${theme.colors.accent.light};
    `}
  
  ${({ $isToday, $isDragOver, $isSelected, theme }) =>
    !$isToday &&
    !$isDragOver &&
    $isSelected &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.accent.primary};
    `}
  
  ${({ $isToday, $isDragOver, $isSelected, theme }) =>
    !$isToday &&
    !$isDragOver &&
    !$isSelected &&
    css`
      border: 1px solid ${theme.colors.border.default};
      background: ${theme.colors.surface};
      color: ${theme.colors.text.secondary};

      &:hover {
        border-color: ${theme.colors.border.hover};
        background: ${theme.colors.surfaceHover};
      }
    `}
`;

export const DayButton = styled.button`
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  align-items: flex-start;
  justify-content: flex-end;
  text-align: left;
  background: none;
  margin-bottom: 5px;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
`;

// Tasks Container
export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TasksList = styled.div`
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Task Item
interface TaskItemProps {
  $isMutable: boolean;
  $isDragging: boolean;
}

export const TaskItem = styled.div<TaskItemProps>`
  padding: 8px 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-radius: 0;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  cursor: pointer;
  word-wrap: break-word;
  transition: background ${({ theme }) => theme.transitions.fast};

  ${({ $isMutable, theme }) =>
    $isMutable
      ? css`
          background: ${theme.colors.task.background};
          color: ${theme.colors.task.text};
          cursor: grab;

          &:hover {
            background: ${theme.colors.task.hover};
          }

          &:active {
            cursor: grabbing;
          }
        `
      : css`
          background: ${theme.colors.holiday.background};
          color: ${theme.colors.holiday.text};
          cursor: default;
          border: 1px dashed #000000;
          &:hover {
            background: ${theme.colors.holiday.hover};
          }
        `}

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      opacity: 0.5;
    `}
`;

// Task Overlay (Edit/Add forms)
export const TaskOverlay = styled.div`
  position: absolute;
  z-index: 30;
`;

export const TaskForm = styled.div`
  padding: 1px 5px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.task.background};
  color: ${({ theme }) => theme.colors.task.text};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

export const TaskInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  margin-bottom: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.light};
  }
`;

export const TaskTextArea = styled.textarea`
  width: 100%;
  padding: 4px 6px;
  margin-bottom: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: none;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.light};
  }
`;

export const TaskButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;

  > button {
    flex: 1;
  }
`;

interface TaskButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
}

export const TaskButton = styled.button<TaskButtonProps>`
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: ${theme.colors.task.background};
          color: ${theme.colors.text.primary};

          &:hover {
            background: ${theme.colors.border.hover};
            border-color: ${theme.colors.border.default};
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.task.background};
          color: ${theme.colors.text.primary};

          &:hover {
            background: ${theme.colors.danger};
            border-color: ${theme.colors.danger};
            color: ${theme.colors.text.inverse};
          }
        `;
      default:
        return css`
          background: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.default};

          &:hover {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.border.hover};
          }
        `;
    }
  }}
`;

// Modal Overlay
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.overlay};

  @media (min-width: 640px) {
    padding: 24px;
  }
`;

export const ModalContent = styled.section`
  width: 100%;
  max-width: 560px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.accent.light};
  background: ${({ theme }) => theme.colors.accent.light};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  @media (min-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

export const CloseButton = styled.button`
  padding: 6px 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.accent.hover};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accent.light};
  }
`;

// Loading Container
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
