import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegexTester from '../RegexTester';

describe('RegexTester', () => {
  it('renders the regex tester interface', () => {
    render(<RegexTester />);
    
    expect(screen.getByLabelText('Pattern:')).toBeInTheDocument();
    expect(screen.getByLabelText('Test String:')).toBeInTheDocument();
    expect(screen.getByLabelText('Case Insensitive (i)')).toBeInTheDocument();
    expect(screen.getByLabelText('Multiline (m)')).toBeInTheDocument();
    expect(screen.getByLabelText('Global (g)')).toBeInTheDocument();
  });

  it('matches simple patterns correctly', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, 'abc 123 def');
    
    // Verify the match is in the results section
    const matchText = screen.getByTestId('match-text-0');
    expect(matchText).toHaveTextContent('123');
    
    // Verify no other matches exist
    expect(screen.queryByTestId('match-text-1')).not.toBeInTheDocument();
  });

  it('handles regex flags correctly', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    const globalFlag = screen.getByLabelText('Global (g)');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, '123 456 789');
    await userEvent.click(globalFlag);
    
    // Verify all matches are in the results section
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('123');
    expect(screen.getByTestId('match-text-1')).toHaveTextContent('456');
    expect(screen.getByTestId('match-text-2')).toHaveTextContent('789');
    expect(screen.queryByTestId('match-text-3')).not.toBeInTheDocument();
    
    // Verify match indices
    expect(screen.getByTestId('match-index-0')).toHaveTextContent('Match 1:');
    expect(screen.getByTestId('match-index-1')).toHaveTextContent('Match 2:');
    expect(screen.getByTestId('match-index-2')).toHaveTextContent('Match 3:');
  });

  it('handles case insensitive flag correctly', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    const caseInsensitiveFlag = screen.getByLabelText('Case Insensitive (i)');
    
    await userEvent.type(patternInput, 'hello');
    await userEvent.type(testStringInput, 'Hello World');
    await userEvent.click(caseInsensitiveFlag);
    
    const matchText = screen.getByTestId('match-text-0');
    expect(matchText).toHaveTextContent('Hello');
    expect(screen.queryByTestId('match-text-1')).not.toBeInTheDocument();
  });

  it('displays error for invalid regex pattern', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    fireEvent.change(patternInput, { target: { value: '[invalid' } });
    fireEvent.change(testStringInput, { target: { value: 'test string' } });
    
    // Look for error message specifically in the input group
    const errorMessage = screen.getAllByText(/Invalid regular expression/i)[0];
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.className).toBe('_errorMessage_215c0b');
  });

  it('handles regex groups correctly', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '(\\w+)@(\\w+\\.\\w+)');
    await userEvent.type(testStringInput, 'test@example.com');
    
    // Verify the full match
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('test@example.com');
    
    // Verify groups
    expect(screen.getByTestId('group-0-0')).toHaveTextContent('Group 1: test');
    expect(screen.getByTestId('group-0-1')).toHaveTextContent('Group 2: example.com');
  });

  it('shows no matches message when pattern does not match', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, 'abc');
    
    expect(screen.getByTestId('no-matches')).toBeInTheDocument();
  });

  it('clears matches when pattern is empty', async () => {
    render(<RegexTester />);
    
    const patternInput = screen.getByLabelText('Pattern:');
    const testStringInput = screen.getByLabelText('Test String:');
    
    await userEvent.type(patternInput, '\\d+');
    await userEvent.type(testStringInput, '123');
    
    expect(screen.getByTestId('match-text-0')).toHaveTextContent('123');
    
    await userEvent.clear(patternInput);
    expect(screen.getByTestId('no-pattern')).toBeInTheDocument();
  });
}); 