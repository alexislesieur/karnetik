<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteOnboardingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'prenom' => [
                'required',
                'string',
                'min:2',
                'max:50',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'prenom.required' => 'Merci de renseigner votre prénom.',
            'prenom.string' => 'Le prénom doit être une chaîne de caractères.',
            'prenom.min' => 'Le prénom doit contenir au moins 2 caractères.',
            'prenom.max' => 'Le prénom ne peut pas dépasser 50 caractères.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('prenom')) {
            $this->merge([
                'prenom' => trim($this->input('prenom')),
            ]);
        }
    }
}
