import { useState, useEffect } from 'react';
import { usePetShop } from '@/contexts/PetShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, Pencil } from 'lucide-react';
import { customerSchema, CustomerFormData } from '@/lib/validations';
import { ZodError } from 'zod';
import { Customer } from '@/types';

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = usePetShop();
  const isEditing = !!customer;

  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
      });
    }
  }, [customer]);

  const validateField = (field: keyof CustomerFormData, value: string) => {
    try {
      customerSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = customerSchema.parse(formData);

      if (isEditing && customer) {
        updateCustomer(customer.id, {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address || '',
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        addCustomer({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address || '',
        });
        toast.success('Cliente cadastrado com sucesso!');
        setFormData({ name: '', email: '', phone: '', address: '' });
      }
      
      setErrors({});
      onSuccess?.();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof CustomerFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof CustomerFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        toast.error('Verifique os campos do formulário');
      } else {
        toast.error(isEditing ? 'Erro ao atualizar cliente' : 'Erro ao cadastrar cliente');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-elevated border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Pencil className="h-5 w-5 text-primary" />
              Editar Cliente
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5 text-primary" />
              Novo Cliente
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                validateField('name', e.target.value);
              }}
              placeholder="Nome completo"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                validateField('email', e.target.value);
              }}
              placeholder="email@exemplo.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                validateField('phone', e.target.value);
              }}
              placeholder="(00) 00000-0000"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                validateField('address', e.target.value);
              }}
              placeholder="Rua, número - Cidade"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? (isEditing ? 'Atualizando...' : 'Cadastrando...') 
              : (isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
