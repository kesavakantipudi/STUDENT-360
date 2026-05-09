import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateLong(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export function getDaysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getGradeColor(grade) {
  const map = { 'O': '#10b981', 'A+': '#10b981', 'A': '#f97316', 'B+': '#06b6d4', 'B': '#f59e0b', 'C+': '#f97316', 'C': '#ef4444', 'F': '#dc2626' };
  return map[grade] || '#a1a1aa';
}

export function getSeverityClass(severity) {
  const map = { 'Low': 'severity-low', 'Medium': 'severity-medium', 'High': 'severity-high' };
  return map[severity] || 'severity-low';
}

export function getStatusClass(status) {
  const map = { 'Pending': 'status-pending', 'Resolved': 'status-resolved', 'Active': 'status-active' };
  return map[status] || 'status-pending';
}

export function calculateCGPA(results) {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.percentage, 0);
  return (total / results.length / 10).toFixed(2);
}

export function getPercentage(marks, total) {
  return ((marks / total) * 100).toFixed(1);
}

export function truncate(str, len = 50) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function generateInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function getAvatarColor(name) {
  const colors = ['#f97316', '#f59e0b', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899'];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(','),
    ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getDifficultyColor(difficulty) {
  const map = { 'Easy': '#10b981', 'Medium': '#f59e0b', 'Hard': '#ef4444' };
  return map[difficulty] || '#a1a1aa';
}

export function getExamStatusColor(status) {
  const map = { 'upcoming': '#f97316', 'scheduled': '#06b6d4', 'completed': '#10b981', 'cancelled': '#ef4444' };
  return map[status] || '#a1a1aa';
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
