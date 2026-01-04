import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'

interface Props{
    open: boolean;
    title: string;
    description: React.ReactNode;
    destructive?: boolean;
    cancelText?: string;
    confirmText?: string;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
}

export const ConfirmDialog = ({
    open,
    setOpen,
    title,
    description,
    onConfirm,
    destructive,
    cancelText = 'Cancelar',
    confirmText = 'Confirmar',
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type='button'>{cancelText}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={ destructive ? 'bg-red-600 hover:bg-red-700 text-white' : '' }
            >
                {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
