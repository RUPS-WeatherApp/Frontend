import { Typography, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Info = ({ maxHeight }) => {
  const theme = useTheme();

  return (
    <Box sx={{ height: maxHeight, overflowY: 'auto', position: "relative" }}>
      <Container sx={{ pt: 2, }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Informacije
        </Typography>

        Projekt je nastal pri predmetu <b>Razvoj upravljanje programskih sistemov</b>.
      </Container>
    </Box>
  );
}

export default Info;