"use client"

import { useState } from 'react';
import { DiscussionNode } from '@/lib/types';
import { formatNumber, getOperationSymbol } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddOperationForm from './AddOperationForm';
import { useStore } from '@/store/useStore';

interface TreeNodeProps {
  node: DiscussionNode;
  level?: number;
}

export default function TreeNode({ node, level = 0 }: TreeNodeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useStore();

  return (
    <div className="my-2">
      <Card className="inline-block">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div>
              {node.operation && node.operand !== null && (
                <div className="text-sm text-slate-600 mb-1">
                  {getOperationSymbol(node.operation)} {formatNumber(node.operand)}
                </div>
              )}
              <div className="text-2xl font-bold">
                = {formatNumber(node.value)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                by {node.author.username}
              </div>
            </div>
            
            {user && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    + Respond
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Operation to {formatNumber(node.value)}</DialogTitle>
                  </DialogHeader>
                  <AddOperationForm 
                    parentId={node.id} 
                    onClose={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {node.children && node.children.length > 0 && (
        <div className="ml-8 mt-2 border-l-2 border-slate-300 pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}