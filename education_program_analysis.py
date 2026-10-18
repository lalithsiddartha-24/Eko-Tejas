# ============================================================
# EDUCATION PROGRAM EVALUATION
# Purpose:
# Evaluate whether the 2-year education program affected
# creativity, innovation-related outcomes, and academics.
# ============================================================

import pandas as pd
import numpy as np
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt

# ------------------------------------------------------------
# 1. LOAD DATA
# ------------------------------------------------------------
FILE_NAME = "dataset (1).csv"
df = pd.read_csv(FILE_NAME)

print("=" * 70)
print("DATASET OVERVIEW")
print("=" * 70)
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])
print(df.head())

# ------------------------------------------------------------
# 2. BASIC DATA CHECKS
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("TREATMENT GROUPS")
print("=" * 70)

print(df["treatment"].value_counts().sort_index())
print("\n0 = Control / standard curriculum")
print("1 = Treatment / program")

print("\nUnique students:", df["student_id"].nunique())
print("Unique schools:", df["school_id"].nunique())
print("Treatment schools:",
      df.loc[df["treatment"] == 1, "school_id"].nunique())
print("Control schools:",
      df.loc[df["treatment"] == 0, "school_id"].nunique())

# ------------------------------------------------------------
# 3. REMOVE DUPLICATE STUDENTS
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("DUPLICATE CHECK")
print("=" * 70)

duplicate_count = df["student_id"].duplicated().sum()
print("Duplicate student records:", duplicate_count)

df = df.drop_duplicates(subset="student_id").copy()

print("Students after removing duplicates:",
      df["student_id"].nunique())

# ------------------------------------------------------------
# 4. CLEAN EXPLORATION VARIABLE
# ------------------------------------------------------------
def clean_percentage(value):
    if pd.isna(value):
        return np.nan

    if isinstance(value, str):
        value = value.strip()

        if value.endswith("%"):
            return float(value[:-1])

        return float(value)

    return float(value)

df["el_exploration_pct"] = (
    df["el_exploration_pct"].apply(clean_percentage)
)

# ------------------------------------------------------------
# 5. CHECK MISSING VALUES
# ------------------------------------------------------------
important_columns = [
    "student_id",
    "school_id",
    "treatment",
    "bl_creativity_score",
    "el_creativity_score",
    "el_exploration_pct",
    "el_ps_pct",
    "el_grit_pct",
    "bl_math_pct",
    "el_math_pct",
    "bl_science_pct",
    "el_science_pct"
]

print("\n" + "=" * 70)
print("MISSING VALUES")
print("=" * 70)

print(df[important_columns].isnull().sum())

# ------------------------------------------------------------
# 6. REGRESSION FUNCTION
# ------------------------------------------------------------
def run_regression(data, formula):
    model = smf.ols(
        formula,
        data=data
    ).fit(
        cov_type="cluster",
        cov_kwds={"groups": data["school_id"]}
    )

    effect = model.params["treatment"]
    ci_low, ci_high = model.conf_int().loc["treatment"]
    p_value = model.pvalues["treatment"]

    return model, {
        "Effect": effect,
        "CI Low": ci_low,
        "CI High": ci_high,
        "P-value": p_value,
        "N": len(data),
        "Schools": data["school_id"].nunique()
    }

# ------------------------------------------------------------
# 7. PRIMARY ANALYSIS: CREATIVITY
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("PRIMARY ANALYSIS: CREATIVITY")
print("=" * 70)

creativity = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "bl_creativity_score",
        "el_creativity_score"
    ]
].dropna()

creativity_model, creativity_result = run_regression(
    creativity,
    "el_creativity_score ~ treatment + bl_creativity_score"
)

print(creativity_model.summary())

# ------------------------------------------------------------
# 8. SECONDARY ANALYSIS: EXPLORATION
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("SECONDARY ANALYSIS: EXPLORATION")
print("=" * 70)

exploration = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "el_exploration_pct"
    ]
].dropna()

exploration_model, exploration_result = run_regression(
    exploration,
    "el_exploration_pct ~ treatment"
)

print(exploration_model.summary())

# ------------------------------------------------------------
# 9. SECONDARY ANALYSIS: PROBLEM SOLVING
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("SECONDARY ANALYSIS: PROBLEM SOLVING")
print("=" * 70)

problem_solving = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "el_ps_pct"
    ]
].dropna()

ps_model, ps_result = run_regression(
    problem_solving,
    "el_ps_pct ~ treatment"
)

print(ps_model.summary())

# ------------------------------------------------------------
# 10. SECONDARY ANALYSIS: GRIT
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("SECONDARY ANALYSIS: GRIT")
print("=" * 70)

grit = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "el_grit_pct"
    ]
].dropna()

grit_model, grit_result = run_regression(
    grit,
    "el_grit_pct ~ treatment"
)

print(grit_model.summary())

# ------------------------------------------------------------
# 11. SECONDARY ANALYSIS: MATHEMATICS
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("SECONDARY ANALYSIS: MATHEMATICS")
print("=" * 70)

math = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "bl_math_pct",
        "el_math_pct"
    ]
].dropna()

math_model, math_result = run_regression(
    math,
    "el_math_pct ~ treatment + bl_math_pct"
)

print(math_model.summary())

# ------------------------------------------------------------
# 12. SECONDARY ANALYSIS: SCIENCE
# ------------------------------------------------------------
print("\n" + "=" * 70)
print("SECONDARY ANALYSIS: SCIENCE")
print("=" * 70)

science = df[
    [
        "student_id",
        "school_id",
        "treatment",
        "bl_science_pct",
        "el_science_pct"
    ]
].dropna()

science_model, science_result = run_regression(
    science,
    "el_science_pct ~ treatment + bl_science_pct"
)

print(science_model.summary())

# ------------------------------------------------------------
# 13. FINAL RESULTS TABLE
# ------------------------------------------------------------
results = pd.DataFrame({
    "Creativity": creativity_result,
    "Exploration": exploration_result,
    "Problem Solving": ps_result,
    "Grit": grit_result,
    "Mathematics": math_result,
    "Science": science_result
}).T

print("\n" + "=" * 70)
print("FINAL RESULTS TABLE")
print("=" * 70)

print(
    results[
        ["Effect", "CI Low", "CI High", "P-value", "N", "Schools"]
    ].round(3)
)

# ------------------------------------------------------------
# 14. TREATMENT VS CONTROL MEANS
# ------------------------------------------------------------
variables = [
    "el_creativity_score",
    "el_exploration_pct",
    "el_ps_pct",
    "el_grit_pct",
    "el_math_pct",
    "el_science_pct"
]

group_means = df.groupby("treatment")[variables].mean()

group_means.index = ["Control", "Treatment"]

print("\n" + "=" * 70)
print("TREATMENT VS CONTROL MEANS")
print("=" * 70)

print(group_means.round(2))

# ------------------------------------------------------------
# 15. CREATE FIGURE
# ------------------------------------------------------------
plot_data = results[
    ["Effect", "CI Low", "CI High"]
].copy()

outcomes = [
    "Creativity",
    "Exploration",
    "Problem Solving",
    "Grit",
    "Mathematics",
    "Science"
]

plot_data = plot_data.loc[outcomes]

y_positions = np.arange(len(plot_data))

lower_error = plot_data["Effect"] - plot_data["CI Low"]
upper_error = plot_data["CI High"] - plot_data["Effect"]

plt.figure(figsize=(9, 5.5))

plt.errorbar(
    plot_data["Effect"],
    y_positions,
    xerr=[lower_error, upper_error],
    fmt="o",
    capsize=4
)

plt.axvline(0, linestyle="--")

plt.yticks(y_positions, outcomes)
plt.xlabel("Estimated treatment effect")
plt.ylabel("Outcome")
plt.title("Estimated Program Effects with 95% Confidence Intervals")

plt.tight_layout()

plt.savefig(
    "program_effects.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

# ------------------------------------------------------------
# 16. SAVE RESULTS
# ------------------------------------------------------------
results.to_csv("program_analysis_results.csv")

print("\n" + "=" * 70)
print("ANALYSIS COMPLETE")
print("=" * 70)

print("Results saved to: program_analysis_results.csv")
print("Figure saved to: program_effects.png")
