package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"

	_ "github.com/lib/pq"
)

func main() {
	// 1. Koneksi Database
	// We use the same URL from docker-compose configuration
	dbURL := "postgres://thearinazs:MonsterBoom_124701@localhost:5434/nutritrack?sslmode=disable"
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 2. Definisi Master Nutrients & Units
	nutrientUnits := map[string]string{
		"Caloric Value": "kcal", "Fat": "g", "Saturated Fats": "g",
		"Monounsaturated Fats": "g", "Polyunsaturated Fats": "g",
		"Carbohydrates": "g", "Sugars": "g", "Protein": "g",
		"Dietary Fiber": "g", "Cholesterol": "mg", "Sodium": "g",
		"Water": "g", "Vitamin A": "mg", "Vitamin B1": "mg",
		"Vitamin B11": "mg", "Vitamin B12": "mg", "Vitamin B2": "mg",
		"Vitamin B3": "mg", "Vitamin B5": "mg", "Vitamin B6": "mg",
		"Vitamin C": "mg", "Vitamin D": "mg", "Vitamin E": "mg",
		"Vitamin K": "mg", "Calcium": "mg", "Copper": "mg",
		"Iron": "mg", "Magnesium": "mg", "Manganese": "mg",
		"Phosphorus": "mg", "Potassium": "mg", "Selenium": "mg",
		"Zinc": "mg", "Nutrition Density": "index",
	}

	ctx := context.Background()

	// 3. SEED MASTER NUTRIENTS
	// Simpan UUID nutrient ke map untuk referensi cepat
	nutrientIDMap := make(map[string]string)
	for name, unit := range nutrientUnits {
		var id string
		
		// UPSERT with returning ID
		err := db.QueryRowContext(ctx,
			`INSERT INTO nutrients (name, unit) 
			 VALUES ($1, $2) 
			 ON CONFLICT (name) DO UPDATE SET unit = EXCLUDED.unit 
			 RETURNING id`,
			name, unit).Scan(&id)
		
		if err != nil {
			log.Printf("Gagal insert nutrient %s: %v", name, err)
			continue
		}
		nutrientIDMap[name] = id
	}
	fmt.Println("✅ Master nutrients seeded.")

	// 4. SEED FOODS & PIVOT
	for i := 1; i <= 5; i++ {
		filename := fmt.Sprintf("scripts/FOOD-DATA-GROUP%d.csv", i)
		file, err := os.Open(filename)
		if err != nil {
			log.Printf("Bypass: Gagal membuka %s: %v", filename, err)
			continue
		}
		
		reader := csv.NewReader(file)
		header, err := reader.Read() // Ambil header: [,Unnamed, food, Caloric Value, dst]
		if err != nil {
			file.Close()
			continue
		}

		// Iterasi tiap baris data
		for {
			record, err := reader.Read()
			if err != nil {
				break
			}

			if len(record) < 3 {
				continue // Skip empty or invalid lines
			}

			// Mulai Transaksi per baris food (Atomic)
			tx, err := db.BeginTx(ctx, nil)
			if err != nil {
				log.Println("Tx error:", err)
				continue
			}

			// Insert Food (Asumsi data per 100g sesuai CSV-mu)
			foodName := record[2] // Index 2 is the food name
			var foodID string
			err = tx.QueryRowContext(ctx,
				"INSERT INTO foods (name, serving_size, serving_unit) VALUES ($1, 100, 'g') RETURNING id",
				foodName).Scan(&foodID)

			if err != nil {
				tx.Rollback()
				log.Printf("Gagal insert food %s: %v", foodName, err)
				continue
			}

			// Insert Nutrients (Mulai dari kolom index 3 dst)
			for j := 3; j < len(header) && j < len(record); j++ {
				nutrientName := header[j]
				nutrientID, exists := nutrientIDMap[nutrientName]
				if !exists {
					continue
				}

				val, err := strconv.ParseFloat(record[j], 64)
				if err != nil || val == 0 {
					continue // Skip if not a number or 0
				}

				_, err = tx.ExecContext(ctx,
					"INSERT INTO food_nutrients (food_id, nutrient_id, amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
					foodID, nutrientID, val)

				if err != nil {
					log.Printf("Gagal insert pivot %s-%s: %v", foodName, nutrientName, err)
				}
			}

			if err = tx.Commit(); err != nil {
				log.Println("Commit error:", err)
			} else {
				fmt.Printf("🚀 Seeded: %s\n", foodName)
			}
		}
		file.Close()
	}
	
	fmt.Println("🎉 Seeding complete!")
}
