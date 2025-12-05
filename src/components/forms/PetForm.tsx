import { useState, useEffect } from 'react';
import { usePetShop } from '@/contexts/PetShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PawPrint, Pencil } from 'lucide-react';
import { PetSpecies, Pet } from '@/types';
import { petSchema, PetFormData } from '@/lib/validations';
import { ZodError } from 'zod';

interface PetFormProps {
  pet?: Pet;
  onSuccess?: () => void;
}

const speciesOptions: { value: PetSpecies; label: string }[] = [
  { value: 'dog', label: 'Cachorro' },
  { value: 'cat', label: 'Gato' },
  { value: 'bird', label: 'Pássaro' },
  { value: 'rabbit', label: 'Coelho' },
  { value: 'other', label: 'Outro' },
];

export function PetForm({ pet, onSuccess }: PetFormProps) {
  const { addPet, updatePet, customers } = usePetShop();
  const isEditing = !!pet;

  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: (pet?.species || '') as PetSpecies | '',
    breed: pet?.breed || '',
    age: pet?.age?.toString() || '',
    weight: pet?.weight?.toString() || '',
    customerId: pet?.customerId || '',
    notes: pet?.notes || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age.toString(),
        weight: pet.weight.toString(),
        customerId: pet.customerId,
        notes: pet.notes,
      });
    }
  }, [pet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToValidate = {
        name: formData.name,
        species: formData.species || undefined,
        breed: formData.breed || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        customerId: formData.customerId,
        notes: formData.notes || undefined,
      };

      const validatedData = petSchema.parse(dataToValidate);

      if (isEditing && pet) {
        updatePet(pet.id, {
          name: validatedData.name,
          species: validatedData.species,
          breed: validatedData.breed || '',
          age: validatedData.age || 0,
          weight: validatedData.weight || 0,
          customerId: validatedData.customerId,
          notes: validatedData.notes || '',
        });
        toast.success('Pet atualizado com sucesso!');
      } else {
        addPet({
          name: validatedData.name,
          species: validatedData.species,
          breed: validatedData.breed || '',
          age: validatedData.age || 0,
          weight: validatedData.weight || 0,
          customerId: validatedData.customerId,
          notes: validatedData.notes || '',
        });
        toast.success('Pet cadastrado com sucesso!');
        setFormData({
          name: '',
          species: '',
          breed: '',
          age: '',
          weight: '',
          customerId: '',
          notes: '',
        });
      }

      setErrors({});
      onSuccess?.();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof PetFormData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof PetFormData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        toast.error('Verifique os campos do formulário');
      } else {
        toast.error(isEditing ? 'Erro ao atualizar pet' : 'Erro ao cadastrar pet');
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
              Editar Pet
            </>
          ) : (
            <>
              <PawPrint className="h-5 w-5 text-primary" />
              Novo Pet
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Nome do Pet *</Label>
            <Input
              id="petName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do pet"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Espécie *</Label>
              <Select
                value={formData.species}
                onValueChange={(value: PetSpecies) =>
                  setFormData({ ...formData, species: value })
                }
              >
                <SelectTrigger className={errors.species ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.species && (
                <p className="text-sm text-destructive">{errors.species}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Raça</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Raça"
                className={errors.breed ? 'border-destructive' : ''}
              />
              {errors.breed && (
                <p className="text-sm text-destructive">{errors.breed}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade (anos)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="0"
                className={errors.age ? 'border-destructive' : ''}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0.0"
                className={errors.weight ? 'border-destructive' : ''}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dono *</Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData({ ...formData, customerId: value })}
            >
              <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione o dono" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && (
              <p className="text-sm text-destructive">{errors.customerId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Alergias, preferências, etc."
              rows={3}
              className={errors.notes ? 'border-destructive' : ''}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? (isEditing ? 'Atualizando...' : 'Cadastrando...') 
              : (isEditing ? 'Atualizar Pet' : 'Cadastrar Pet')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
