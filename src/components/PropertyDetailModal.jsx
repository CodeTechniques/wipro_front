import Modal from "./Modal";
import PropertyDetailContent from "./PropertyDetailContent";

export default function PropertyDetailModal({
  propertyId,
  isOpen,
  onClose,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <PropertyDetailContent propertyId={propertyId} />
    </Modal>
  );
}
