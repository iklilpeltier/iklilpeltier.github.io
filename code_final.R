# ==============================================================================
# OPTIMISATION RECETTE COOKIES - CODE COMPLET CORRIGÉ
# ==============================================================================

rm(list=ls())
# library(FrF2) # Pas nécessaire ici

# Fonction de transformation (Codage Centré Réduit)
code_val <- function(x, min_v, max_v) {
  return( (x - (min_v + max_v)/2) / ((max_v - min_v)/2) )
}

# ------------------------------------------------------------------------------
# PHASE 0 : PARAMÉTRAGE THÉORIQUE
# ------------------------------------------------------------------------------
nb_facteurs <- 4
essais_requis <- 2^nb_facteurs
cat("Essais nécessaires pour plan complet :", essais_requis, "\n")


# ------------------------------------------------------------------------------
# PHASE 1 : ÉTUDE PRÉLIMINAIRE (PLAN 2^2)
# ------------------------------------------------------------------------------
cat("\n--- RÉSULTATS PHASE 1 ---\n")

# Données expérimentales
T1_data <- data.frame(
  Temp_Reelle = c(160, 160, 200, 200),
  Temps_Reelle = c(8, 12, 8, 12),
  Note = c(34, 54, 68, 42)
)

# Codage des variables et calcul interaction
T1_data$A <- code_val(T1_data$Temp_Reelle, 160, 200)
T1_data$B <- code_val(T1_data$Temps_Reelle, 8, 12)
T1_data$AB <- T1_data$A * T1_data$B

# Modélisation matricielle (CORRIGÉ : as.matrix + cbind)
X1 <- as.matrix(cbind(I=1, A=T1_data$A, B=T1_data$B, AB=T1_data$AB))
Y1 <- as.matrix(T1_data$Note)
Theta1 <- (1/4) * t(X1) %*% Y1

print("Coefficients estimés (Modèle 1) :")
print(Theta1)

# Fonction de prévision basée sur le modèle
modele_phase1 <- function(temp, temps) {
  ac <- code_val(temp, 160, 200)
  bc <- code_val(temps, 8, 12)
  # Coeffs : 49.5, 5.5, -1.5, -11.5
  return(49.5 + 5.5*ac - 1.5*bc - 11.5*ac*bc)
}

# Calculs prévisionnels
cat("Prev 190°C/10min :", modele_phase1(190, 10), "\n")
cat("Prev 185°C/12min :", modele_phase1(185, 12), "\n")
cat("Prev Cible (200°C/8min) :", modele_phase1(200, 8), "\n")


# ------------------------------------------------------------------------------
# PHASE 2 : OPTIMISATION (PLAN FRACTIONNAIRE)
# ------------------------------------------------------------------------------
cat("\n--- RÉSULTATS PHASE 2 ---\n")

# Chargement du plan d'expérience
df_t2 <- data.frame(
  A = c(-1,  1, -1,  1, -1,  1, -1,  1), # Temp
  D = c(-1, -1,  1,  1, -1, -1,  1,  1), # Pépites (Attention ordre spécifique)
  C = c(-1, -1, -1, -1,  1,  1,  1,  1), # Choco
  B = c(-1,  1,  1, -1,  1, -1, -1,  1), # Temps
  Y = c(53, 26, 98, 61, 37, 49, 92, 12)  # Notes
)

# Création des interactions pour la matrice
df_t2$AB <- df_t2$A * df_t2$B
df_t2$AC <- df_t2$A * df_t2$C
df_t2$AD <- df_t2$A * df_t2$D

# Vérification Hadamard (Orthogonalité)
# CORRIGÉ : as.matrix + cbind
X_sat <- as.matrix(cbind(I=1, A=df_t2$A, B=df_t2$B, C=df_t2$C, D=df_t2$D, 
                         AB=df_t2$AB, AC=df_t2$AC, AD=df_t2$AD))
cat("Vérification Matrice (Diagonale) :\n")
print(t(X_sat) %*% X_sat)

# Estimation des effets (Modèle Saturé)
# CORRIGÉ : as.matrix
Theta_sat <- (1/8) * t(X_sat) %*% as.matrix(df_t2$Y)
print("Effets modèle saturé (triés) :")
print(Theta_sat[order(abs(Theta_sat)), , drop=FALSE])

# Modèle Final (AC supprimé -> part dans les résidus)
# On utilise les colonnes calculées AB et AD
model_final <- lm(Y ~ A + B + C + D + AB + AD, data = df_t2)

# Affichage du TABLEAU ANOVA
cat("\n--- TABLEAU DE SÉLECTION (ANOVA) ---\n")
print(anova(model_final))

# Variances (Basée sur l'interaction AC rejetée)
var_res <- summary(model_final)$sigma^2 
var_coeff <- var_res / 8
cat("Variance des coefficients :", var_coeff, "\n")


# ------------------------------------------------------------------------------
# GÉNÉRATION DES GRAPHIQUES
# ------------------------------------------------------------------------------

# Graphique 1 : Interaction (Phase 1)
interaction.plot(x.factor = T1_data$Temp_Reelle,
                 trace.factor = T1_data$Temps_Reelle,
                 response = T1_data$Note,
                 type = "b", col = c("blue", "red"), pch = 19, lwd = 2,
                 xlab = "Température (°C)", ylab = "Note Moyenne",
                 trace.label = "Temps", main = "Interaction Température / Temps")

# Graphique 2 : Surface de réponse (Phase 1)
x_grid <- seq(-1, 1, length=30)
y_grid <- seq(-1, 1, length=30)
z_vals <- outer(x_grid, y_grid, function(a,b) 49.5 + 5.5*a - 1.5*b - 11.5*a*b)

persp(x_grid, y_grid, z_vals, theta = 45, phi = 25, col = "lightblue",
      xlab = "Temp (A)", ylab = "Temps (B)", zlab = "Note",
      main = "Surface de Réponse 3D")

# Graphique 3 : Courbes de niveaux (Phase 1)
contour(x_grid, y_grid, z_vals, nlevels = 10, col = "red", lwd = 2,
        xlab = "Température (codée)", ylab = "Temps (codé)",
        main = "Carte des Iso-réponses")
points(1, -1, pch=19, col="darkgreen", cex=2) # Optimum

# Graphique 4 : Pareto des effets (Phase 2)
# CORRIGÉ : Conversion en vecteur pour éviter les erreurs de format matrice
effets_t2 <- as.vector(Theta_sat[2:8,]) 
names(effets_t2) <- c("A", "B", "C", "D", "AB", "AC", "AD")
effets_tries <- effets_t2[order(abs(effets_t2))]

par(mar=c(4, 6, 2, 1))
barplot(abs(effets_tries), horiz = TRUE, las = 1, col = "steelblue",
        main = "Impact des Facteurs (Pareto)", xlab = "Amplitude de l'effet")
abline(v=1, col="red", lty=2)
