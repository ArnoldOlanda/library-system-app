import React from 'react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Props{
    variant: 'destructive' | 'outline';
    onClick: () => void;
    icon: React.ReactNode;
    tooltipText?: string;
}

export const TableButtonAction = ({ variant, onClick, icon, tooltipText }: Props) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    size='icon'
                    onClick={onClick}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    )
}
