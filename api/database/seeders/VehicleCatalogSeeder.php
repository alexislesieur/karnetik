<?php

namespace Database\Seeders;

use App\Models\VehicleBrand;
use App\Models\VehicleModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VehicleCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalogue = [
            'Audi' => [
                'A1',
                'A3',
                'Q3',
            ],

            'BMW' => [
                'Série 1',
                'Série 3',
                'X1',
            ],

            'Citroën' => [
                'C3',
                'C4',
                'C5 Aircross',
            ],

            'Dacia' => [
                'Sandero',
                'Duster',
                'Jogger',
            ],

            'Fiat' => [
                '500',
                'Panda',
                'Tipo',
            ],

            'Ford' => [
                'Fiesta',
                'Focus',
                'Puma',
            ],

            'Hyundai' => [
                'i20',
                'i30',
                'Tucson',
            ],

            'Kia' => [
                'Picanto',
                'Ceed',
                'Sportage',
            ],

            'Mercedes-Benz' => [
                'Classe A',
                'Classe C',
                'GLA',
            ],

            'Nissan' => [
                'Micra',
                'Qashqai',
                'Juke',
            ],

            'Peugeot' => [
                '208',
                '308',
                '3008',
            ],

            'Renault' => [
                'Clio',
                'Captur',
                'Megane',
            ],

            'Tesla' => [
                'Model 3',
                'Model S',
                'Model Y',
            ],

            'Toyota' => [
                'Yaris',
                'Corolla',
                'RAV4',
            ],

            'Volkswagen' => [
                'Polo',
                'Golf',
                'Tiguan',
            ],
        ];

        foreach ($catalogue as $brandName => $models) {
            $brand = VehicleBrand::query()->updateOrCreate(
                [
                    'slug' => Str::slug($brandName),
                ],
                [
                    'nom' => $brandName,
                    'actif' => true,
                ],
            );

            foreach ($models as $modelName) {
                VehicleModel::query()->updateOrCreate(
                    [
                        'vehicle_brand_id' => $brand->id,
                        'slug' => Str::slug($modelName),
                    ],
                    [
                        'nom' => $modelName,
                        'actif' => true,
                    ],
                );
            }
        }
    }
}
