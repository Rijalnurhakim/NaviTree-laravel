<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data existing
        Menu::truncate();

        // Buat menu utama
        $products = Menu::create(['name' => 'Produk', 'order' => 1]);
        $about = Menu::create(['name' => 'Tentang Kami', 'order' => 2]);
        $contact = Menu::create(['name' => 'Kontak', 'order' => 3]);

        // Buat submenu untuk Produk
        Menu::create(['name' => 'Elektronik', 'parent_id' => $products->id, 'order' => 1]);
        Menu::create(['name' => 'Fashion', 'parent_id' => $products->id, 'order' => 2]);
        Menu::create(['name' => 'Rumah Tangga', 'parent_id' => $products->id, 'order' => 3]);

        // Buat sub-submenu
        $electronics = Menu::where('name', 'Elektronik')->first();
        Menu::create(['name' => 'Smartphone', 'parent_id' => $electronics->id, 'order' => 1]);
        Menu::create(['name' => 'Laptop', 'parent_id' => $electronics->id, 'order' => 2]);
        Menu::create(['name' => 'Aksesoris', 'parent_id' => $electronics->id, 'order' => 3]);
    }
}
