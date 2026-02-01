import { Award, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCertification as addCertificationAction,
  updateCertification as updateCertificationAction,
  deleteCertification as deleteCertificationAction,
} from '../app/features/certificationSlice';

const CertificationForm = ({ data = [], onChange }) => {
    const dispatch = useDispatch();
    const certifications = useSelector((state) => state.certification.certifications);

    const addCertification = () => {
        const newCertification = {
            name: "",
            issuer: "",
            issue_date: "",
            expiry_date: "",
            credential_id: "",
            credential_url: "",
        };
        dispatch(addCertificationAction(newCertification));
        onChange([...certifications, newCertification]);
    }

    const removeCertification = (index) => {
        const certId = certifications[index]?.id;
        if (certId) {
            dispatch(deleteCertificationAction(certId));
        }
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateCertification = (index, field, value) => {
        const cert = certifications[index];
        if (cert) {
            const updatedCert = { ...cert, [field]: value };
            dispatch(updateCertificationAction(updatedCert));
        }
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }
    
  return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Sertifikatlar
          </h3>
          <p className="text-sm text-gray-500">
            Aldığınız sertifikatları əlavə edin
          </p>
        </div>
        <button onClick={addCertification} className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ">
          <Plus className="size-4" />
          Sertifikat əlavə et
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Sertifikat daxil edilməyib.</p>
            <p className="text-sm">Başlamaq üçün 'Sertifikat əlavə et' seçimini edin</p>
        </div>
      ): (
        <div className="space-y-4">
            {data.map((certification, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium">Sertifikat #{index + 1}</h4>
                        <button onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="size-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <input value={certification.name || ""} onChange={(e) => updateCertification(index, "name", e.target.value)} type="text" placeholder="Sertifikat adı (məs: AWS Solutions Architect)" className="px-3 py-2 text-sm" />
                        <input value={certification.issuer || ""} onChange={(e) => updateCertification(index, "issuer", e.target.value)} type="text" placeholder="Verən təşkilat (məs: Amazon Web Services)" className="px-3 py-2 text-sm" />
                        <input value={certification.issue_date || ""} onChange={(e) => updateCertification(index, "issue_date", e.target.value)} type="month" placeholder="Verilmə tarixi" className="px-3 py-2 text-sm" />
                        <input value={certification.expiry_date || ""} onChange={(e) => updateCertification(index, "expiry_date", e.target.value)} type="month" placeholder='Son keçərlilik tarixi' className="px-3 py-2 text-sm" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <input value={certification.credential_id || ""} onChange={(e) => updateCertification(index, "credential_id", e.target.value)} type="text" placeholder='Sertifikat nömrəsi (məs: AWS-1234567890)' className="px-3 py-2 text-sm" />
                        <input value={certification.credential_url || ""} onChange={(e) => updateCertification(index, "credential_url", e.target.value)} type="url" placeholder='Sertifikat URL (məs: https://...)' className="px-3 py-2 text-sm" />
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default CertificationForm
