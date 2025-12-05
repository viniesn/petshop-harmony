import { useState } from 'react';
import { usePetShop } from '@/contexts/PetShopContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PetForm } from '@/components/forms/PetForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PawPrint, Plus, Search, User, Scale, Clock, Pencil, Trash2 } from 'lucide-react';
import { PetSpecies, Pet } from '@/types';
import { toast } from 'sonner';

const speciesLabels: Record<PetSpecies, string> = {
  dog: 'Cachorro',
  cat: 'Gato',
  bird: 'Pássaro',
  rabbit: 'Coelho',
  other: 'Outro',
};

const speciesEmoji: Record<PetSpecies, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
};

export default function Pets() {
  const { pets, getCustomerById, deletePet } = usePetShop();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase()) ||
    pet.breed.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    deletePet(id);
    toast.success(`Pet "${name}" excluído com sucesso!`);
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setIsEditDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pets</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os pets cadastrados
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <PetForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {editingPet && (
              <PetForm 
                pet={editingPet} 
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setEditingPet(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => {
            const owner = getCustomerById(pet.customerId);
            return (
              <Card key={pet.id} className="animate-fade-in hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-light text-3xl">
                        {speciesEmoji[pet.species]}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pet.breed || speciesLabels[pet.species]}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary">{speciesLabels[pet.species]}</Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(pet)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o pet "{pet.name}"? 
                                Esta ação também excluirá todos os agendamentos associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pet.id, pet.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Dono: {owner?.name || 'Desconhecido'}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Scale className="h-4 w-4" />
                      {pet.weight} kg
                    </div>
                  </div>
                  {pet.notes && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Obs:</span> {pet.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Nenhum pet encontrado</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
