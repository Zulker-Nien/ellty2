"use client"

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import TreeNode from './TreeNode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DiscussionTree() {
    const { discussions, fetchDiscussions, createDiscussion, user, loading } = useStore();
    const [startingNumber, setStartingNumber] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchDiscussions();
        const interval = setInterval(fetchDiscussions, 5000); 
        return () => clearInterval(interval);
    }, [fetchDiscussions]);

    const handleCreateDiscussion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDiscussion(parseInt(startingNumber));
            setStartingNumber('');
            setIsDialogOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Discussion Tree</h2>
                {user && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Start New Discussion</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Start a New Discussion</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateDiscussion} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Starting Number
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder="Enter a starting number"
                                        value={startingNumber}
                                        onChange={(e) => setStartingNumber(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? 'Creating...' : 'Create Discussion'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading && discussions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Loading discussions...</div>
            ) : discussions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    No discussions yet. {user ? 'Start one!' : 'Login to start one!'}
                </div>
            ) : (
                <div className="space-y-6">
                    {discussions.map((discussion) => (
                        <TreeNode key={discussion.id} node={discussion} />
                    ))}
                </div>
            )}
        </div>
    );
}