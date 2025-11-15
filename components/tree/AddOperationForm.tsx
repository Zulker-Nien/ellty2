"use client"

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Operation } from '@/lib/types';

interface AddOperationFormProps {
    parentId: string;
    onClose: () => void;
}

export default function AddOperationForm({ parentId, onClose }: AddOperationFormProps) {
    const [operation, setOperation] = useState<Operation>(Operation.ADD);
    const [operand, setOperand] = useState('');
    const { addOperation, loading } = useStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addOperation(parentId, operation, parseInt(operand));
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Operation</label>
                <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as Operation)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    disabled={loading}
                >
                    <option value={Operation.ADD}>Addition (+)</option>
                    <option value={Operation.SUBTRACT}>Subtraction (-)</option>
                    <option value={Operation.MULTIPLY}>Multiplication (×)</option>
                    <option value={Operation.DIVIDE}>Division (÷)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Number</label>
                <Input
                    type="number"
                    step="any"
                    placeholder="Enter a number"
                    value={operand}
                    onChange={(e) => setOperand(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Operation'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}