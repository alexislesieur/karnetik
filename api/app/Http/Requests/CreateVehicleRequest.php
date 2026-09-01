<?php

namespace App\Http\Requests;

use App\Models\VehicleBrand;
use App\Models\VehicleModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'vehicle_brand_id' => [
                'required',
                'integer',
                'exists:vehicle_brands,id',
            ],

            'vehicle_model_id' => [
                'required',
                'integer',
                'exists:vehicle_models,id',
            ],

            'immatriculation' => [
                'required',
                'string',
                'regex:/^[A-Z]{2}-\d{3}-[A-Z]{2}$/',
            ],

            'kilometrage_actuel' => [
                'required',
                'integer',
                'min:0',
                'max:9999999',
            ],

            'mise_en_circulation' => [
                'required',
                'date_format:Y-m-d',
                'before_or_equal:today',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_brand_id.required' => 'Merci de sélectionner une marque.',
            'vehicle_brand_id.exists' => 'La marque sélectionnée est invalide.',

            'vehicle_model_id.required' => 'Merci de sélectionner un modèle.',
            'vehicle_model_id.exists' => 'Le modèle sélectionné est invalide.',

            'immatriculation.required' => 'Merci de renseigner l’immatriculation.',
            'immatriculation.regex' => 'Format attendu : AA-123-AA.',

            'kilometrage_actuel.required' => 'Merci de renseigner le kilométrage.',
            'kilometrage_actuel.integer' => 'Le kilométrage doit être un nombre entier.',
            'kilometrage_actuel.min' => 'Le kilométrage ne peut pas être négatif.',
            'kilometrage_actuel.max' => 'Le kilométrage est trop élevé.',

            'mise_en_circulation.required' => 'Merci de renseigner la mise en circulation.',
            'mise_en_circulation.date_format' => 'Format de date invalide.',
            'mise_en_circulation.before_or_equal' => 'La mise en circulation ne peut pas être dans le futur.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $immatriculation = $this->input('immatriculation');

        if (is_string($immatriculation)) {
            $this->merge([
                'immatriculation' => strtoupper(
                    trim($immatriculation),
                ),
            ]);
        }
    }

    protected function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (
                !$this->filled('vehicle_brand_id') ||
                !$this->filled('vehicle_model_id')
            ) {
                return;
            }

            $model = VehicleModel::query()
                ->where('id', $this->input('vehicle_model_id'))
                ->where('actif', true)
                ->first();

            if (!$model) {
                $validator->errors()->add(
                    'vehicle_model_id',
                    'Le modèle sélectionné est invalide.',
                );

                return;
            }

            if (
                (int) $model->vehicle_brand_id !==
                (int) $this->input('vehicle_brand_id')
            ) {
                $validator->errors()->add(
                    'vehicle_model_id',
                    'Le modèle sélectionné ne correspond pas à la marque.',
                );
            }

            $brand = VehicleBrand::query()
                ->where('id', $this->input('vehicle_brand_id'))
                ->where('actif', true)
                ->exists();

            if (!$brand) {
                $validator->errors()->add(
                    'vehicle_brand_id',
                    'La marque sélectionnée est invalide.',
                );
            }
        });
    }
}
