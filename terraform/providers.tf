terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "infra-backend-489717"
  region  = "us-central1"
  zone    = "us-central1-c"
}
