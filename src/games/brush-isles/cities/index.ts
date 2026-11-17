import type { Style, StyleId } from '../styles';
import { amsterdam } from './amsterdam';
import { kaifeng } from './kaifeng';
import { raiatea } from './raiatea';
import { tenochtitlan } from './tenochtitlan';

export const STYLES: Record<StyleId, Style> = { tenochtitlan, kaifeng, raiatea, amsterdam };
