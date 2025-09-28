"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useVehicle,
} from "@/hooks/useApi";
import {
  VehiclesHeader,
  VehiclesStats,
  VehiclesFilters,
  VehicleForm,
  VehiclesTable,
  VistoriasModal,
} from "./_components";
import { Vehicle } from "@/types";

export default function VeiculosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVistoriasModal, setShowVistoriasModal] = useState(false);
  const [vistoriasFilter, setVistoriasFilter] = useState<
    "all" | "with" | "without"
  >("all");
  const [formData, setFormData] = useState({
    nome: "",
    placa: "",
    modelo: "",
    marca: "",
    ano: new Date().getFullYear().toString(),
    proprietario: "",
  });

  const { data: vehicles, isLoading, refetch } = useVehicles();
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();
  const { data: vehicleDetails } = useVehicle(selectedVehicle?.id || "");

  const filteredVehicles =
    vehicles?.filter((vehicle) => {
      // Filtro de busca por texto
      const matchesSearch =
        vehicle.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.nome &&
          vehicle.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vehicle.proprietario &&
          vehicle.proprietario
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Filtro de vistorias
      const vistoriasCount = vehicle._count?.vistorias || 0;
      let matchesVistoriasFilter = true;

      if (vistoriasFilter === "with") {
        matchesVistoriasFilter = vistoriasCount > 0;
      } else if (vistoriasFilter === "without") {
        matchesVistoriasFilter = vistoriasCount === 0;
      }

      return matchesSearch && matchesVistoriasFilter;
    }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        ano: parseInt(formData.ano, 10),
      };
      if (editingVehicle) {
        await updateVehicleMutation.mutateAsync({
          id: editingVehicle.id,
          data: dataToSend,
        });
      } else {
        await createVehicleMutation.mutateAsync(dataToSend);
      }

      // Recarregar a lista de veículos
      refetch();

      setShowForm(false);
      setEditingVehicle(null);
      setFormData({
        nome: "",
        placa: "",
        modelo: "",
        marca: "",
        ano: new Date().getFullYear().toString(),
        proprietario: "",
      });
    } catch (err) {
      console.error("Erro ao salvar veículo:", err);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      nome: vehicle.nome || "",
      placa: vehicle.placa,
      modelo: vehicle.modelo,
      marca: vehicle.marca,
      ano: vehicle.ano.toString(),
      proprietario: vehicle.proprietario || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        await deleteVehicleMutation.mutateAsync(id);
        // Recarregar a lista de veículos
        refetch();
      } catch (err) {
        console.error("Erro ao excluir veículo:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setFormData({
      nome: "",
      placa: "",
      modelo: "",
      marca: "",
      ano: new Date().getFullYear().toString(),
      proprietario: "",
    });
  };

  const handleViewVistorias = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVistoriasModal(true);
  };

  const closeVistoriasModal = () => {
    setShowVistoriasModal(false);
    setSelectedVehicle(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <VehiclesHeader onNewVehicle={() => setShowForm(true)} />

        <VehiclesStats
          vehicles={vehicles}
          filteredVehicles={filteredVehicles}
        />

        <VehicleForm
          showForm={showForm}
          editingVehicle={editingVehicle}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={
            createVehicleMutation.isPending || updateVehicleMutation.isPending
          }
        />

        <VehiclesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          vistoriasFilter={vistoriasFilter}
          onVistoriasFilterChange={setVistoriasFilter}
        />

        <VehiclesTable
          vehicles={filteredVehicles}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewVistorias={handleViewVistorias}
          isDeleting={deleteVehicleMutation.isPending}
        />

        <VistoriasModal
          show={showVistoriasModal}
          selectedVehicle={selectedVehicle}
          vehicleDetails={vehicleDetails}
          onClose={closeVistoriasModal}
        />
      </div>
    </MainLayout>
  );
}
