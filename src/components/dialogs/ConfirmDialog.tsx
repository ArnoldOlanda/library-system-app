import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'

interface Props{
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
}

export const ConfirmDialog = ({
    open,
    setOpen,
    title,
    description,
    onConfirm,
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
              className="bg-destructive text-white hover:bg-destructive/90"
            >
                {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
